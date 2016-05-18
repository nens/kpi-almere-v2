/* globals Promise:true */
import queryString from 'query-string';
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './configureStore.jsx';
import App from './components/App2.jsx';
import jwtDecode from 'jwt-decode';

// The following section is needed to get a JWT token for futher XHR requests
// --------------------------------------------------------------------------

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

// Now start the application by rendering it into the root div
// -----------------------------------------------------------

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <App username={localStorage.getItem('username')} />
  </Provider>,
  document.getElementById('root')
);
