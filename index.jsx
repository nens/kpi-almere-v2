/* globals Promise:true */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './configureStore.jsx';
import App from './components/App.jsx';
import $ from 'jquery';

const piEndpoint = $.ajax({
  type: 'GET',
  url: 'https://nxt.staging.lizard.net/api/v2/pi/',
  xhrFields: {
    withCredentials: true,
  },
  success: (data) => {
    return data;
  },
});

Promise.all([piEndpoint]).then((data) => {
  // Count the available PI's. If zero, redirect to auth page...
  // This is not a temporary measure. A new endpoint should be made for checking
  // auth status from a serverless JS app such as this one...
  if (data[0].count === 0) {
    window.location.href = `https://nxt.staging.lizard.net/accounts/login?next=${window.location.href}`;
  }
});

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
