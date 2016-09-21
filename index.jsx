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

const piEndpoint = $.ajax({
  type: 'GET',
  url: `${config.apiBaseUrl}/bootstrap/kpi/`,
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
  if (data[0].pis.length === 0) {
    window.location.href = `${config.apiBaseUrl}/accounts/login/?next=${window.location.href}`;
  }
  else {
    const languageFromBootstrap = data[0].locale;
    const messages = localeData[languageFromBootstrap];// || localeData[language] || localeData.en;

    // Create a Redux Store object which will be passed to the App Component
    // using the Provider HoC
    const store = configureStore();

    ReactDOM.render(
      <IntlProvider
        messages={messages}
        locale={languageFromBootstrap}>
        <Provider store={store}>
          <App />
        </Provider>
      </IntlProvider>,
      document.getElementById('root')
    );
  }
});
