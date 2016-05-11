lizard-kpi
==========

This is the 2nd iteration of the [KPI prototype](http://nens.github.io/kpi-prototype/#/).

The main goal of this prototype is to connect it to the Lizard 6 API.

Other goals are:

 * A visually attractive PI dashboard

 * A fast UI
 
 * Readable codebase and stable front-end performance (ie. minimal amount of bugs)


Demo
====

[http://nens.github.io/kpi-almere-v2/](http://nens.github.io/kpi-almere-v2/)


Technical
=========

 * Written in [ES6](https://nodejs.org/en/docs/es6/)

 * Unidirectional dataflow (json-->App-->child-->child etc.)

 * One source of truth (API), (mostly) stateless child components

 * [Babel](http://babeljs.io/) for ES6-to-JS

 * [Fetch](https://developer.mozilla.org/en/docs/Web/API/Fetch_API) for XHR ([polyfilled](https://github.com/github/fetch) for all-browsers-support)

 * [D3.js](https://d3js.org/) for scale, range and domain functions

 * Chart and Map SVG rendering done with [React.js](https://facebook.github.io/react/)

 * [React.js](https://facebook.github.io/react/) for application UI

 * [CSS modules](https://github.com/css-modules/css-modules) for styling

 * [velocity-react](https://github.com/twitter-fabric/velocity-react/) for fast animation (in Chart component)

 * [Webpack](https://webpack.github.io/) and [HMR](https://webpack.github.io/docs/hot-module-replacement.html) for module bundling / building

 * [NPM](https://www.npmjs.com/) for package management

 * Talks to [Django REST Framework](http://www.django-rest-framework.org/)

 * Authentication via [JWT](https://jwt.io/)

 * Linting via [ESLint](http://eslint.org/)

 * Typechecked with [Flow](http://flowtype.org/)




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

Assumptions: Node.js `v5.10.1` and NPM `3.8.3` installed globally.

On OSX: `$ brew update && brew install node`

On (recent) Ubuntu: `$ sudo apt-get update && sudo apt-get install nodejs nodejs-legacy`



Installing dependencies
-----------------------

```
$ npm install
```

This will install all thats needed to develop or build.



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


Production
==========

To build a production bundle, in the root of the project:

```
$ NODE_ENV=production webpack -p --config webpack.production.config.js
```
This disables the HMR functionality and minifies the code as much as possible. Places `bundle.js` in `dist/`. Will propbably output warnings which you can ignore safely.


ESlint
======

The code is written in ES6 and compiled to regular JS with [Babel](http://babeljs.io/). Be sure to install [ESLint](http://eslint.org/) support [in your editor](http://eslint.org/docs/user-guide/integrations).

There's support for [Atom](https://atom.io/packages/linter-eslint), [Sublime](https://github.com/roadhump/SublimeLinter-eslint), [Vim](https://github.com/scrooloose/syntastic/tree/master/syntax_checkers/javascript), [PyCharm](http://plugins.jetbrains.com/plugin/7494) and [Emacs](http://www.flycheck.org/manual/latest/Supported-languages.html#Javascript).

*Linting is a tool, not a goal. Try to get most issues resolved but don't panic if
some remain.*




Todo
====

See [Trello](https://trello.com/b/Mc074A5k/pi-dashboards) for the most up-to-date todo list.


In general
----------

 * Determine application structure: REST API, application state, components, dataflow using props.

 * Tryout: Use [Redux](http://redux.js.org/) instead of 'manually' managing state?

 * Tryout: Implement async data loading using [redux-thunk](https://github.com/gaearon/redux-thunk)?

 * Implement JWT auth flow (via `https://sso.lizard.net/jwt/?portal=<portal-id>&next=<url>`, see https://nxt.staging.lizard.net/doc/plugins.html)


App component
-------------

* Enable daterange setting


Chart component
---------------

* Background axes

* Mouseovers value labels

* Zooming?


Map component
-------------

* Region switch button. Pressing it will load another geometry/pi set.




References
==========

* [React Data Visualization](http://fraserxu.me/2015/06/03/react-data-visualization/) - Excellent article on how to use React itself for SVG rendering

* [React & Data viz](http://slides.com/fraserxu/deck#/) - Presentation accompanying this ^^ article

* [react-data-visualization](https://github.com/fraserxu/react-data-visualization) - Repo of ^^ article

* [React port of D3 Choropleth](http://bl.ocks.org/pleasetrythisathome/9713092)

* [Generating SVG with React](https://www.smashingmagazine.com/2015/12/generating-svg-with-react/) - By Smashing Magazine

* [react-svg-chart](https://github.com/colinmeinke/react-svg-chart) - Nice looking React charts (entirely without D3!). See [BarChart](https://github.com/colinmeinke/react-svg-chart/blob/master/src/BarChart.js)

* [chartjs-react](http://jhudson8.github.io/react-chartjs/) and [some other stuff](https://gist.github.com/tdboone/fdd1ea6a6912d635475b)
