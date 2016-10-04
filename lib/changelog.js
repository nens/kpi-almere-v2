var fs = require('fs');
var Q = require('q');
var semver = require('semver');


var read = Q.denodeify(fs.readFile);
var write = Q.denodeify(fs.writeFile);

var findLine = function (data) {
  if (data) {
    var linebyline = data.split('\n');
    var preciseString = find(linebyline, 'Unreleased')[0];
    var lineNr = linebyline.indexOf(preciseString);
    return {
      lineNr: lineNr,
      data: linebyline
    };
  };
};

var match = function (searchString) {
  return function (toBeSearched) {
    return toBeSearched.match(searchString);
  };
};


var find = function (data, string) {
  return data.filter(match(string));
};

var getDate = function () {
  var date = new Date();
  var dateString = [ date.getYear() + 1900,
    date.getMonth() + 1,
    date.getDate()
  ]
  return dateString.join('-');
};

var createReleaseLine = function (release) {
  var releaseString = [
    'Release ',
    release,
    ' (',
    getDate(),
    ')']
  return releaseString.join('');
}

var insertLines = function (options) {
  var data = options.data,
      lineNr = options.lineNr,
      release = options.release;

  data.splice(lineNr + 2, 0, createReleaseLine(release), '---------------------');
  data.splice(lineNr + 2, 0, '-', '\n');

  return data;
};

var writeLines = function (fileName, lines) {
  var data = lines.join('\n');
  return write(fileName, data, 'utf8');
};


/**
 *
 * Updates changelog automatically.
 * updateChangelog(release, [fileName, outFile]], callback)
 *
 */
var updateChangelog = function (args) {

  var deferred = (args.deferred) ?  args.deferred : Q.defer(),
      fileName = (args.inFile) ? args.inFile : 'CHANGES.rst',
      outFile = (args.outFile) ? args.outFile : fileName,
      release;

  if (typeof args === 'string') {
    release = (semver.valid(args)) ? args : null;
  } else {
    release = (semver.valid(args.release)) ? args.release : null;
  }

  if (!release) {
    console.log('Not doing anything. bye');
    deferred.reject();
    return null;
  }

  console.log('Updating Changelog', fileName);

  read(fileName, 'utf8')
    .then(findLine)
    .then(function (options) {
      options.release = release;
      return insertLines(options);
      })
    .then(function (data) {
      writeLines(outFile, data).then(function () {
        deferred.resolve();
      });
     return;
      });

    return deferred.promise;

};


module.exports = updateChangelog;
