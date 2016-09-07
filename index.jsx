/* globals Promise:true */
import 'babel-polyfill';
import config from './config.jsx';
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
import localeData from './build/locales/data.json';

addLocaleData([...en, ...nl]);

// Define user's language. Different browsers have the user locale defined
// on different fields on the `navigator` object, so we make sure to account
// for these different by checking all of them
const language = (navigator.languages && navigator.languages[0]) ||
                     navigator.language ||
                     navigator.userLanguage;

// Split locales with a region code
const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];
const messages = localeData[languageWithoutRegionCode];// || localeData[language] || localeData.en;

const piEndpoint = $.ajax({
  type: 'GET',
  url: `${config.apiBaseUrl}/api/v2/pi/`,
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
    window.location.href = `${config.apiBaseUrl}/accounts/login/?next=${window.location.href}`;
  }
  else {
    // Create a Redux Store object which will be passed to the App Component
    // using the Provider HoC
    const store = configureStore();

    ReactDOM.render(
      <IntlProvider
        messages={messages}
        locale={language}>
        <Provider store={store}>
          <App />
        </Provider>
      </IntlProvider>,
      document.getElementById('root')
    );
  }
});
