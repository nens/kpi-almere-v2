kpi-dashboard
==========

This is the 2nd iteration of the [KPI prototype](http://nens.github.io/kpi-prototype/#/).

The main goal of this prototype is to connect it to the Lizard 6 API.


Demo
====

[http://nens.github.io/kpi-dashboard/](http://nens.github.io/kpi-dashboard/)


Screenshot (August 2016)
========================

![Screenshot](https://raw.githubusercontent.com/nens/kpi-dashboard/master/screenshot-august-2016.jpg)



Technical
=========

 * Unidirectional dataflow (json-->App-->child-->child etc.) using [Redux](http://redux.js.org/).

 * One source of truth (API), (mostly) stateless child components

 * [React.js](https://facebook.github.io/react/) for application UI

 * [CSS modules](https://github.com/css-modules/css-modules) for styling

 * [Webpack](https://webpack.github.io/) and [HMR](https://webpack.github.io/docs/hot-module-replacement.html) for module bundling / building

 * Talks to [Django REST Framework](http://www.django-rest-framework.org/)

 * Linting via [ESLint](http://eslint.org/)



Project installation / setup
============================

Preparation
-----------

Assumptions: Node.js `6.3.1` and NPM `3.10.6` installed globally.

* On OSX: `$ brew update && brew install node` (or upgrade using `$ brew update && brew upgrade node && npm install -g npm`) - or just install using the official installer from [nodejs.org](https://nodejs.org/en/).

* On (recent) Ubuntu: `$ sudo apt-get update && sudo apt-get install nodejs nodejs-legacy`



Installing dependencies
-----------------------

Globally, install `babel-cli`: `$ npm install -g babel-cli`.

In the project directory:  
~~$ npm install~~

EDIT due to problems with webpack do yarn install instead:
```
$ yarn install
```


This will install all thats needed to develop or build.

**Note** An `npm-shrinkwrap.json` file is included to ensure the right dependencies are installed.

Please re-generate it when changing dependencies in `package.json`.



Development
===========

To start development, in the root of the project:  
~~$ npm start~~

EDIT due to problems with webpack do yarn start instead:
```
$ yarn start
```
This will start Webpack in Hot Module Replacement (HMR) mode and will also
create a source-map file for debugging.
Open http://localhost:3000 in a webbrowser... Most changes will reflect instantly,
or your console will tell you to refresh manually. Error messages will be shown in the browser as well, for easy debugging.

Dev trouble
===========

If you get redirected to a login on dev, but this does not work, then I worked around it by commenting out:  
if (data[0].pis.length === 0) {  
    window.location.href = `/accounts/login/?next=${window.location.href}`;  
  }  
You wil not get to run all features, but maybe just enough to test a small change (in my case).  


Translations
------------

The main messages catalog files will be generated automatically by `babel-plugin-react-intl` ([link](https://github.com/yahoo/babel-plugin-react-intl)).

This catalog can be found under `build/messages/components/COMPONENT.json` and each of those files has a format similar to:
```
[
  {
    "id": "app.apptitle",
    "defaultMessage": "Dashboard Performance Indicators"
  },
  ...
]
```

Use `translate.js` in the root of the project to generate a flat collection of translations:

```
$ babel-node translate.js
```


Production
==========

To build a production bundle, in the root of the project:

```
$ NODE_ENV=production webpack -p --config webpack.production.config.js
```
This disables the HMR functionality and minifies the code as much as possible. Places `index.html` and `bundle.js` in `dist/`. Will propbably output warnings which you can ignore safely.


Releasing
=========
Check if your `deploy/` folder has a `auth.json` file with a github token.
To start off, make sure webpack has a built version in the dist folder 

	npm run build

This creates a build in the dist/ folder.

To tag this as a new release and to add the dist folder to the release attachments you we use nens/buck-trap. It versions your repo and changes the changelog for you.

	npm run buck-trap

NOTE: buck-trap assumes:

    There is a package.json.
    You release from master branch.
    There is a dist folder which will be attached to the release on github

Releasing hotfixes or patches

If a stable release is coming out release it and start a new branch for the stable release e.g.:

	git checkout -b release4.0

If stuff is fixed on this branch, the fixes can be rolled out as patches without affecting the mainline release track. To run buck-trap from this branch and to release the branch with its CHANGELOG.md

	npm run buck-trap -- -b release4.0

The fixes and the CHANGELOG.md would have to be merged with master, which might give some merge conflicts. C'est la vie.

If a release went wrong and you, don't worry just fix the error and run it again. It will bump the version again, but who cares.


Deployment
==========

For the deployment of frontend repositories we make use of an Ansible script in the lizard-nxt repository.
More information is provided in the readme file of lizard-nxt: https://github.com/nens/lizard-nxt/blob/master/README.rst
Look below the heading "Deployment clients".


ESlint
======

The code is written in ES6 and compiled to regular JS with [Babel](http://babeljs.io/).

Be sure to install [ESLint](http://eslint.org/) support [in your editor](http://eslint.org/docs/user-guide/integrations).

There's support for [Atom](https://atom.io/packages/linter-eslint), [Sublime](https://github.com/roadhump/SublimeLinter-eslint), [Vim](https://github.com/scrooloose/syntastic/tree/master/syntax_checkers/javascript), [PyCharm](http://plugins.jetbrains.com/plugin/7494), [Emacs](http://www.flycheck.org/manual/latest/Supported-languages.html#Javascript) and [VSCode](https://code.visualstudio.com/).
