/* globals Promise:true */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './configureStore.jsx';
import App from './components/App.jsx';
import $ from 'jquery';
import {
    addLocaleData,
    injectIntl,
    IntlProvider,
    FormattedRelative,
} from 'react-intl';
import en from 'react-intl/locale-data/en';
import nl from 'react-intl/locale-data/nl';
import messages from './messages.jsx';
addLocaleData([...en, ...nl]);

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
  <IntlProvider
    messages={messages.nl}
    locale='nl'>
    <Provider store={store}>
      <App />
    </Provider>
  </IntlProvider>,
  document.getElementById('root')
);


//
