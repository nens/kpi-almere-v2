var fs = require('fs');
var changelog = require('./lib/changelog');
var semver = require('semver');
var Q = require('q');
var shell = require('shelljs');
var git = require('git-rev');

var done = Q.async();

var newVersion, newDevVersion, currentBranch;

function getCurrentBranch(type) {
  var prom = Q.defer();

  git.branch(function (s) {
    prom.resolve({'currentBranch': s, 'type': type});
  });

  return prom.promise;
}

function setup(obj) {
  var pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  newVersion = pkg.version;
  newVersion = semver.inc(pkg.version, obj.type || 'patch');
  newDevVersion = newVersion + 'dev';
  currentBranch = obj.currentBranch;
  console.log('newVersion', newVersion);
  console.log('newDevVersion', newDevVersion);
  console.log('currentBranch', currentBranch);
  return pkg;
}

function bumpPackage(pkg) {
  pkg.version = newVersion;
  fs.writeFile('package.json', JSON.stringify(
      pkg, null, 2) + '\n');

  return newVersion;
}

function commitChanges() {
  console.log('committing');
  return shell.exec(
    'git commit -am "Changed package.json and changelog to ' +
    newVersion +
    ' "', {silent: false}
  );
}

function newBranch() {
  return shell.exec('git checkout -b build_branch');
}

function changeGitIgnore() {
  return shell.exec('mv .buildignore .gitignore');
}

function addDist() {
  return shell.exec('git add dist/');
}

function commitDist() {
  return shell.exec(
    'git commit -am "Releasing with Dist: ' + newVersion + ' "');
}

function subTreePush() {
  return shell.exec('git subtree push --prefix dist/ origin ' + options.upstream);
}

function checkoutDist() {
  return shell.exec('git checkout origin/' + options.upstream);
}

function devTag() {
  return shell.exec(
    'git tag -a ' + newDevVersion +
    ' -m "New Release: ' + newDevVersion + '"');
}

function mergeDevTag() {
  return shell.exec('git merge ' + currentBranch + ' build_branch');
}


function tag() {
  return shell.exec(
    'git tag -a ' + newVersion + ' -m "New Release: ' + newVersion + '"');
}

function removeDist() {
  return shell.exec('git push origin :dist --tags');
}

function goBackToBranch() {
  return shell.exec('git checkout ' + currentBranch);
}

function removeBuildBranch() {
  return shell.exec('git branch -D build_branch');
}


var p = new Q();
p.then(getCurrentBranch)
 .then(setup)
 .then(bumpPackage)
 .then(changelog)
 .then(commitChanges)
 .then(devTag)
 .then(mergeDevTag)
 .then(newBranch)
 .then(changeGitIgnore)
 .then(addDist)
 .then(commitDist)
 .then(subTreePush)
 .then(checkoutDist)
 .then(tag)
 .then(removeDist)
 .then(goBackToBranch)
 .then(removeBuildBranch)
 .done(function() {
   console.log('done');
 });
