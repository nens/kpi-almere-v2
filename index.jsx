import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import fetch from 'isomorphic-fetch';
import topojson from 'topojson';
import App from './components/App2.jsx';

let data;

function render(_data) {
  ReactDOM.render(
    <App data={_data} />,
    document.getElementById('root')
  );
}

fetch('./us.topojson')
    .then((response) => {
      if (response.status >= 400) {
        throw new Error('Bad response from server');
      }
      return response.json();
    })
    .then((geo) => {
      const buurtenTopojson = topojson.feature(geo, geo.objects.counties);
      data = {
        chartdata: [
          {
            'title': 'Meldingen burgers - Ingediend',
            'data': [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 15, 52],
            'values': [344, 200, 877, 1234, 232, 1600, 300, 900, 910, 210, 400, 20],
          },
          {
            'title': 'Meldingen burgers - Afgehandeld',
            'data': [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 15, 52],
            'values': [344, 200, 877, 1234, 232, 1600, 300, 900, 910, 210, 400, 20],
          },
          {
            'title': 'Schadeclaims - Toegekend',
            'data': [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 15, 52],
            'values': [344, 200, 877, 1234, 232, 1600, 300, 900, 910, 210, 400, 20],
          },
          {
            'title': 'Enquete - Tevredenheid',
            'data': [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 15, 52],
            'values': [344, 200, 877, 1234, 232, 1600, 300, 900, 910, 210, 400, 20],
          },
          {
            'title': 'Enquete - Tevredenheid',
            'data': [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 15, 52],
            'values': [344, 200, 877, 1234, 232, 1600, 300, 900, 910, 210, 400, 20],
          },
          {
            'title': 'Enquete - Tevredenheid',
            'data': [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 15, 52],
            'values': [344, 200, 877, 1234, 232, 1600, 300, 900, 910, 210, 400, 20],
          },
        ], mapdata: buurtenTopojson,
      };
      render(data);
    });
