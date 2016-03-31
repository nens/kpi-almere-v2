lizard-kpi
==========

This is the 2nd iteration of the [KPI prototype](http://nens.github.io/kpi-prototype/#/).

Goal of this prototype is to connect it to the Lizard 6 API.



Demo
----

[http://nens.github.io/kpi-almere-v2/](http://nens.github.io/kpi-almere-v2/)


State shape
-----------

This object defines the applications initial/root state.

```
{
	startDate: '',
	endData: '',
	isFetching: false,
	pi_data: [
		{
			id: 42,
			title: 'Meldingen burgers - totaal',
			data: [],			
			selected: false
		},
		{
			id: 43,
			title: 'Meldingen burgers - riolering'
			data: [],
			selected: false
		}
	],
	map_data: [

	]
}
```



Development
-----------

In the root of the project

```
$ npm start
```
Then open localhost:3000 in a webbrowser...




Building for production
-----------------------

In the root of the project

```
$ NODE_ENV=production webpack -p --config webpack.production.config.js
```




TODO
----

 * Determine application structure: state, components, dataflow
 
 * Implement data loading using redux-thunk (https://github.com/gaearon/redux-thunk)

 * Implement a choropleth in d3.js

 * Implement a histogram chart in d3.js

 * Get https://demo.lizard.net/api/v2/regions/

 * Implement JWT auth (via https://sso.lizard.net/jwt/?portal=<portal-id>&next=<url>, see https://nxt.staging.lizard.net/doc/plugins.html)

 * http://fraserxu.me/2015/06/03/react-data-visualization/