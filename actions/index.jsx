/*jshint esnext: true*/

import fetch from 'isomorphic-fetch';


export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

function requestLogin(creds) {
  return {
    type: LOGIN_REQUEST,
    isFetching: true,
    isAuthenticated: false,
    creds
  };
}

function receiveLogin(user) {
  return {
    type: LOGIN_SUCCESS,
    isFetching: false,
    isAuthenticated: true,
    // id_token: user.id_token
  };
}

function loginError(message) {
  return {
    type: LOGIN_FAILURE,
    isFetching: false,
    isAuthenticated: false,
    message
  };
}


// Calls the API to get a token and
// dispatches actions along the way
export function loginUser() {

  let currentOrigin = window.location.origin;
  let portal = 'MOFZd4DTHhn0yx4qCJtIe8XdGUGK35StkgPUf8iNJv22AqCviQcwEVIXk3qZcnVh';

  return dispatch => {
    window.location.href = `https://sso.lizard.net/jwt?next=${currentOrigin}&portal=${portal}`;  
  };
}


// Three possible states for our logout process as well.
// Since we are using JWTs, we just need to remove the token
// from localStorage. These actions are more useful if we
// were calling the API to log the user out
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

function requestLogout() {
  return {
    type: LOGOUT_REQUEST,
    isFetching: true,
    isAuthenticated: true
  };
}

function receiveLogout() {
  return {
    type: LOGOUT_SUCCESS,
    isFetching: false,
    isAuthenticated: false
  };
}



// Logs the user out
export function logoutUser() {
  return dispatch => {
  	localStorage.removeItem('access_token');
  	window.location.href = `https://sso.lizard.net/accounts/logout/?next=${currentOrigin}`;
  };
}