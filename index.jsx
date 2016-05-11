/* globals Promise:true */
import queryString from 'query-string';
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App2.jsx';
import jwtDecode from 'jwt-decode';
import $ from 'jquery';
import _ from 'underscore';

const portal = 'MOFZd4DTHhn0yx4qCJtIe8XdGUGK35StkgPUf8iNJv22AqCviQcwEVIXk3qZcnVh';

if (!localStorage.access_token) {
  const currentOrigin = window.location.href;
  window.location.href = `https://sso.lizard.net/jwt?next=${currentOrigin}&portal=${portal}`;
}

const parsedQueryParams = queryString.parse(location.search);
if (parsedQueryParams.access_token) {
  const { username, exp } = jwtDecode(parsedQueryParams.access_token);
  localStorage.setItem('access_token', parsedQueryParams.access_token);
  localStorage.setItem('username', username);
  localStorage.setItem('exp', exp);
  if (history.pushState) {
    const newurl = window.location.protocol + '//' + window.location.host + window.location.pathname;
    window.history.pushState({ path: newurl }, '', newurl);
  }
  else {
    window.location.href = '/';
  }
}

if (localStorage.getItem('exp') && new Date(localStorage.getItem('exp') * 1000) < new Date()) {
  // Token expired. Redirect to SSO to renew...
  // This would ideally be done 'underwater' using fetch(), but CORS...
  const currentOrigin = window.location.href;
  window.location.href = `https://sso.lizard.net/jwt?next=${currentOrigin}&portal=${portal}`;
}

function render(_data) {
  ReactDOM.render(
    <App
      username={localStorage.getItem('username')}
      data={_data} />,
    document.getElementById('root')
  );
}

const regionEndpoint = $.ajax({
  type: 'GET',
  /* eslint-disable */
  url: `https://nxt.staging.lizard.net/api/v2/regions/?type=9&within_portal_bounds=true&format=json&token=${localStorage.getItem('access_token')}`,
  /* eslint-enable */
  success: (data) => {
    return data;
  },
});

const piEndpoint = $.ajax({
  type: 'GET',
  url: `https://nxt.staging.lizard.net/api/v2/pi/?access_token=${localStorage.access_token}`,
  success: (data) => {
    return data;
  },
});

Promise.all([piEndpoint, regionEndpoint]).then(([piResults, regionResults]) => {

  // Now, get the details for every PI object
  const piUrls = piResults.results.map((pi) => {
    return $.ajax({
      type: 'GET',
      url: `${pi.url}?access_token=${localStorage.access_token}`,
    });
  });

  Promise.all(piUrls).then((details) => {
    // Combine the pi detail with the pi parent
    const merged = _.zip(piResults.results, details);

    const zoomlevels = _.unique(piResults.results.map((piresult) => {
      return piresult.boundary_type_name;
    }));

    const data = {
      regions: regionResults,
      piData: merged,
      zoomlevels: zoomlevels,
    };
    render(data);
  });

});
