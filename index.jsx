/* globals Promise:true */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './configureStore.jsx';
import App from './components/App2.jsx';
import $ from 'jquery';

// import {whyDidYouUpdate} from 'why-did-you-update';
// if (process.env.NODE_ENV !== 'production') {
//   whyDidYouUpdate(React);
// }

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
  console.log('data[0].count', data[0].count);
  if (data[0].count === 0) {
    window.location.href = `https://nxt.staging.lizard.net/accounts/login?next=${window.location.href}`;
  }
});

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <App username={localStorage.getItem('username')} />
  </Provider>,
  document.getElementById('root')
);
