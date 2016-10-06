var fs = require('fs');
var pkg = require('./package.json');
var archiver = require('archiver');
var rimraf = require('rimraf');
var github = require('octonode');

var version = pkg.version;
rimraf.sync('./tmp');
fs.mkdirSync('./tmp');

var fileName = __dirname + '/tmp/' + version + '.zip';
var writeFileStream = fs.createWriteStream(fileName);

var client = github.client(require('./deploy/auth.json').token);
var ghrepo = client.repo(pkg.repository.name);

var archive = archiver.create('zip', {});
archive.on('finish', startRelease);
archive.pipe(writeFileStream);

archive.directory('./dist', './');
archive.finalize();

function uploadAssets (err, body) {
  if (err) {
    // console.log('err', err);
    // console.log('body', body);
    if (parseInt(err.statusCode) === 422) {
      console.log(err.body);
      console.log('It looks like there is already a draft or release on github.');
      console.log('Go to https://github.com/' + pkg.repository.name + '/releases/tag/' + version);
      console.log('and delete the release. Yes, this is fine. The tag will still be there.');
    }
  }
  console.log('Created release, getting ready to upload assets');
  var ghrelease = client.release(pkg.repository.name, body.id);
  var readArchive = fs.readFileSync(fileName);

  var htmlUrl = body.html_url;

  ghrelease.uploadAssets(readArchive, {
    contentType: 'application/zip',
    name: version + '.zip',
    size: readArchive.length
  }, function (requesterr, status, respbody, headers) {
    if (requesterr) {
      console.log(Object.keys(requesterr), status, respbody, requesterr)
      // var respbodyerrors = requesterr.body.map(function (berr) {
      //   return ['Field:', berr.field, 'Code:', berr.code, berr.message].join(' ');
      // });
      // var message = [requesterr.message].concat(respbodyerrors);
      // throw new Error(message.join('\n'));
    }

    console.log('Created new release and uploaded assets at: \n' + htmlUrl);
    // rimraf('./tmp', function (rerr) {
    //   if (rerr) { throw rerr; }
    //   console.log('Succesfully cleaned up tmp folder');
    // });
  });
}

function startRelease () {
  ghrepo.release({
    tag_name: version,
    draft: false
  }, uploadAssets);
}

function findRelease () {
  ghrepo.releases(function (err, body) {
    return body.filter(function (release) {
      if (release.tag_name === require('./package.json').version) {
        var ghrelease = client.release(pkg.repository.name, release.id);
        uploadAssets(ghrelease);
      }
    });
  });
}
