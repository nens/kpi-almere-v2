lizard-kpi
==========

This is the 2nd iteration of the [KPI prototype](http://nens.github.io/kpi-prototype/#/).

Goal of this prototype is to connect it to the Lizard 6 API.


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




TODO
----

 * Determine application structure: state, components, dataflow
 
 * Implement data loading using redux-thunk (https://github.com/gaearon/redux-thunk)

 * Implement a choropleth in d3.js

 * Implement a histogram chart in d3.js

 * Get https://demo.lizard.net/api/v2/regions/

 * Implement JWT auth (via https://sso.lizard.net/jwt/?portal=<portal-id>&next=<url>, see https://nxt.staging.lizard.net/doc/plugins.html)

 