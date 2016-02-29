/*jshint esnext: true*/

import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux'

import kpiApp from './reducers';
import fetch from 'isomorphic-fetch';
import createLogger from 'redux-logger';
import App from './components/App';

import thunkMiddleware from 'redux-thunk';
import api from './middleware/api';


const loggerMiddleware = createLogger();


let createStoreWithMiddleware = applyMiddleware(thunkMiddleware, api)(createStore);
let store = createStoreWithMiddleware(kpiApp);
let rootElement = document.getElementById('root');




function render() {
  	ReactDOM.render(
  		<Provider 
  			store={store}>
  			<App />
  		</Provider>, rootElement
	);
}

render();
store.subscribe(render);
