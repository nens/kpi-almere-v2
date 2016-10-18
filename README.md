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
```
$ npm install
```

This will install all thats needed to develop or build.

**Note** An `npm-shrinkwrap.json` file is included to ensure the right dependencies are installed.

Please re-generate it when changing dependencies in `package.json`.



Development
===========

To start development, in the root of the project:

```
$ npm start
```
This will start Webpack in Hot Module Replacement (HMR) mode and will also
create a source-map file for debugging.
Open http://localhost:3000 in a webbrowser... Most changes will reflect instantly,
or your console will tell you to refresh manually. Error messages will be shown in the browser as well, for easy debugging.


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
To start off, make sure webpack has a built version in the dist folder `npm run build`
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


Deployment
==========

To deploy this project to integration or staging, make sure to do the following:

* Copy `deploy/hosts.example` to `deploy/hosts` and edit the servers under [integration] and/or [staging]. For production, do the same but in a copy of `deploy/production_hosts.example`.

* Copy `deploy/auth.json.example` to `deploy/auth.json` and make sure that your [Github token](https://github.com/settings/tokens) is filled out. The access token needs full repo access, so make sure to select the right scopes when creating the token.

Make sure you have Ansible [installed on your system](http://docs.ansible.com/ansible/intro_installation.html).

Run:
```
$ ansible-playbook -i deploy/hosts deploy/deploy.yml -k -K --limit=integration -u your.username --extra-vars="version=0.1.0"
```

Where `--limit` is a safety measure to deploy only to that host and `--extra-vars "version=0.1.0"` defines [which version](https://github.com/nens/kpi-dashboard/releases) to release.


ESlint
======

The code is written in ES6 and compiled to regular JS with [Babel](http://babeljs.io/).

Be sure to install [ESLint](http://eslint.org/) support [in your editor](http://eslint.org/docs/user-guide/integrations).

There's support for [Atom](https://atom.io/packages/linter-eslint), [Sublime](https://github.com/roadhump/SublimeLinter-eslint), [Vim](https://github.com/scrooloose/syntastic/tree/master/syntax_checkers/javascript), [PyCharm](http://plugins.jetbrains.com/plugin/7494), [Emacs](http://www.flycheck.org/manual/latest/Supported-languages.html#Javascript) and [VSCode](https://code.visualstudio.com/).
