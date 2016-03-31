/*jshint esnext: true*/

import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import fetch from 'isomorphic-fetch';
import _ from 'underscore';
import topojson from 'topojson';
import App from './components/App2.jsx';

var data;


function render(data) {
  	ReactDOM.render(
		<App data={data} />, 
		document.getElementById('root')
	);
}

fetch('./us.topojson')
    .then(function(response) {
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        return response.json();
    })
    .then(function(geo) {
    	var buurten_topojson = topojson.feature(geo, geo.objects.counties);
		data = {
			chartdata: [
			  {
			    'title': 'Meldingen burgers - Ingediend',
			    'data': [ 10, 20, 30, 40, 50, 60, 70, 80 ,90, 100, 15, 52 ],
			    'values': [ 344, 200, 877, 1234, 232, 1600, 300, 900 ,910, 210, 400, 20 ],
			  },
			  {
			    'title': 'Meldingen burgers - Afgehandeld',
			    'data': _.shuffle([ 10, 20, 30, 40, 50, 60, 70, 80 ,90, 100, 15, 52 ]),
			    'values': [ 344, 200, 877, 1234, 232, 1600, 300, 900 ,910, 210, 400, 20 ],
			  },
			  {
			    'title': 'Schadeclaims - Toegekend',
			    'data': _.shuffle([ 10, 20, 30, 40, 50, 60, 70, 80 ,90, 100, 15, 52 ]),
			    'values': [ 344, 200, 877, 1234, 232, 1600, 300, 900 ,910, 210, 400, 20 ],
			  },
			  {
			    'title': 'Enquete - Tevredenheid',
			    'data': _.shuffle([ 10, 20, 30, 40, 50, 60, 70, 80 ,90, 100, 15, 52 ]),
			    'values': [ 344, 200, 877, 1234, 232, 1600, 300, 900 ,910, 210, 400, 20 ],
			  },
			  {
			    'title': 'Enquete - Tevredenheid',
			    'data': _.shuffle([ 10, 20, 30, 40, 50, 60, 70, 80 ,90, 100, 15, 52 ]),
			    'values': [ 344, 200, 877, 1234, 232, 1600, 300, 900 ,910, 210, 400, 20 ],
			  },
			  {
			    'title': 'Enquete - Tevredenheid',
			    'data': [ 10, 20, 30, 40, 50, 60, 70, 80 ,90, 100, 15, 52 ],
			    'values': [ 344, 200, 877, 1234, 232, 1600, 300, 900 ,910, 210, 400, 20 ],
			  },
			], mapdata: buurten_topojson
		}    	
		render(data);
    });


