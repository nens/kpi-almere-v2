


lizard-kpi
==========

This is the 2nd iteration of the [KPI prototype](http://nens.github.io/kpi-prototype/#/).

The main goal of this prototype is to connect it to the Lizard 6 API.


Demo
====

[http://nens.github.io/kpi-almere-v2/](http://nens.github.io/kpi-almere-v2/)


Screenshot (August 2016)
========================



Technical
=========

 * Unidirectional dataflow (json-->App-->child-->child etc.) using [Redux](http://redux.js.org/).

 * One source of truth (API), (mostly) stateless child components

 * [React.js](https://facebook.github.io/react/) for application UI

 * [CSS modules](https://github.com/css-modules/css-modules) for styling

 * [Webpack](https://webpack.github.io/) and [HMR](https://webpack.github.io/docs/hot-module-replacement.html) for module bundling / building

 * Talks to [Django REST Framework](http://www.django-rest-framework.org/)

 * Linting via [ESLint](http://eslint.org/)




API endpoint
============

Describes the REST API endpoint.

`https://demo.lizard.net/api/v2/regions/`
-----------------------------------------
Parameters: `z` for zoomlevel (1-22)

Response:
```
{
}
```



State shape
===========

This object describes the applications' initial/root state.

```
{
}
```


Project installation / setup
============================

Preparation
-----------

Assumptions: Node.js `6.3.1` and NPM `3.10.6` installed globally.

* On OSX: `$ brew update && brew install node` (or upgrade using `$ brew update && brew upgrade node && npm install -g npm`)

* On (recent) Ubuntu: `$ sudo apt-get update && sudo apt-get install nodejs nodejs-legacy`



Installing dependencies
-----------------------

Globally, install `babel-cli`: `$ npm install -g babel-cli`.

In the project directory:
```
$ npm install
```

This will install all thats needed to develop or build.
Note that an `npm-shrinkwrap.json` file is present to ensure the right dependencies are installed.

Please re-generate it when changing the dependencies in `package.json` and don't forget to check it in.



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
This disables the HMR functionality and minifies the code as much as possible. Places `bundle.js` in `dist/`. Will propbably output warnings which you can ignore safely.


ESlint
======

The code is written in ES6 and compiled to regular JS with [Babel](http://babeljs.io/).

Be sure to install [ESLint](http://eslint.org/) support [in your editor](http://eslint.org/docs/user-guide/integrations).

There's support for [Atom](https://atom.io/packages/linter-eslint), [Sublime](https://github.com/roadhump/SublimeLinter-eslint), [Vim](https://github.com/scrooloose/syntastic/tree/master/syntax_checkers/javascript), [PyCharm](http://plugins.jetbrains.com/plugin/7494), [Emacs](http://www.flycheck.org/manual/latest/Supported-languages.html#Javascript) and [VSCode](https://code.visualstudio.com/).




References
==========

* [React Data Visualization](http://fraserxu.me/2015/06/03/react-data-visualization/) - Excellent article on how to use React itself for SVG rendering

* [React & Data viz](http://slides.com/fraserxu/deck#/) - Presentation accompanying this ^^ article

* [react-data-visualization](https://github.com/fraserxu/react-data-visualization) - Repo of ^^ article

* [React port of D3 Choropleth](http://bl.ocks.org/pleasetrythisathome/9713092)

* [Generating SVG with React](https://www.smashingmagazine.com/2015/12/generating-svg-with-react/) - By Smashing Magazine

* [react-svg-chart](https://github.com/colinmeinke/react-svg-chart) - Nice looking React charts (entirely without D3!). See [BarChart](https://github.com/colinmeinke/react-svg-chart/blob/master/src/BarChart.js)

* [chartjs-react](http://jhudson8.github.io/react-chartjs/) and [some other stuff](https://gist.github.com/tdboone/fdd1ea6a6912d635475b)



Todo
----

* Kleuren op basis v/d waarde (grafiekdiv)

* Url lizardlogo kloppend maken

* DONE Collapse/expand van series div

* DONE Globale tijdsinstelling ipv per serie

* Kleuren v/d kaart kloppend obv waarde (niet score)
