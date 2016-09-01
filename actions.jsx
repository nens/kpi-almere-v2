/* globals Promise:true */
import $ from 'jquery';
import _ from 'lodash';
import config from './config.jsx';
import bbox from 'turf-bbox';
import centroid from 'turf-centroid';

export const CLEAR_ERROR = 'CLEAR_ERROR';
export const CLEAR_MAP_SELECTION = 'CLEAR_MAP_SELECTION';
export const RECEIVE_INDICATORS = 'RECEIVE_INDICATORS';
export const RECEIVE_REGIONS = 'RECEIVE_REGIONS';
export const REQUEST_INDICATORS = 'REQUEST_INDICATORS';
export const REQUEST_REGIONS = 'REQUEST_REGIONS';
export const SELECT_INDICATOR = 'SELECT_INDICATOR';
export const SET_REFERENCEVALUE_FOR_INDICATOR = 'SET_REFERENCEVALUE_FOR_INDICATOR';
export const SET_DATERANGE_FOR_PI = 'SET_DATERANGE_FOR_PI';
export const SET_DATERANGE = 'SET_DATERANGE';
export const SET_INDICATOR = 'SET_INDICATOR';
export const SET_REGION = 'SET_REGION';
export const SET_ZOOMLEVEL = 'SET_ZOOMLEVEL';
export const SHOW_ERROR = 'SHOW_ERROR';

export function clearError() {
  return {
    type: CLEAR_ERROR,
  };
}

export function clearMapSelection() {
  return {
    type: CLEAR_MAP_SELECTION,
  };
}

function setReferenceValue(indicatorId, referenceValue) {
  return {
    type: SET_REFERENCEVALUE_FOR_INDICATOR,
    indicatorId,
    referenceValue,
  };
}

function showErrorAction(message, level) {
  return {
    type: SHOW_ERROR,
    message,
    level,
  };
}

export function showError(message, level) {
  return dispatch => {
    dispatch(showErrorAction(message, level));
    dispatch(clearError());
  };
}

export function setReferenceValueForIndicator(indicatorId, referenceValue) {
  return dispatch => {
    dispatch(setReferenceValue(indicatorId, referenceValue));
    const referenceValueEndpoint = $.ajax({
      type: 'PUT', // Must be PUT because its an update!
      /* eslint-disable */
      url: `${config.apiBaseUrl}/api/v2/pi/${indicatorId}/`,
      dataType: 'json',
      data: {
        'reference_value': referenceValue,
        'boundary_type': 3,
      },
      xhrFields: {
        withCredentials: true
      },
      /* eslint-enable */
      success: (data) => {
        return data;
      },
      error: (error) => {
        console.error('Error', error);
        dispatch(showError(error.responseJSON.message, 'error'));
      },
    });
    Promise.all([referenceValueEndpoint]).then(([referenceValueResult]) => {
      console.log('referenceValueResult', referenceValueResult);
    });
  };
}

export function setDaterange(rangeType) {
  return {
    type: SET_DATERANGE,
    rangeType,
  };
}

export function setDaterangeForPI(indicatorId, rangeType) {
  return {
    type: SET_DATERANGE_FOR_PI,
    indicatorId,
    rangeType,
  };
}

export function selectIndicator(indicator) {
  return {
    type: SELECT_INDICATOR,
    indicator,
  };
}

function requestIndicators() {
  return {
    type: REQUEST_INDICATORS,
  };
}

function receiveIndicators(piData, zoomlevels) {
  return {
    type: RECEIVE_INDICATORS,
    piData,
    zoomlevels,
    receivedAt: Date.now(),
  };
}

export function fetchIndicators() {
  return dispatch => {
    dispatch(requestIndicators());
    const indicatorEndpoint = $.ajax({
      type: 'GET',
      url: `${config.apiBaseUrl}/api/v2/pi/`,
      xhrFields: {
        withCredentials: true,
      },
      success: (data) => {
        return data;
      },
    });
    Promise.all([indicatorEndpoint]).then(([indicatorResults]) => {
      // Now, get the details for every PI object
      const urls = indicatorResults.results.map((indicator) => {
        return $.ajax({
          type: 'GET',
          url: `${indicator.url}`,
          xhrFields: {
            withCredentials: true,
          },
        });
      });
      Promise.all(urls).then((details) => {
        // Combine the pi detail with the pi parent
        const piData = _.zip(indicatorResults.results, details);
        const zoomlevels = _.uniq(indicatorResults.results.map((piresult) => {
          return piresult.boundary_type_name;
        }));
        return dispatch(receiveIndicators(piData, zoomlevels));
      });
    });
  };
}

function shouldFetchIndicators(state) {
  if (state.indicators.indicators.length > 0) {
    return false;
  }
  return true;
}

export function fetchIndicatorsIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchIndicators(getState())) {
      return dispatch(fetchIndicators());
    }
  };
}


export function setRegion(region) {
  return {
    type: SET_REGION,
    region,
  };
}

export function setIndicator(indicator) {
  return {
    type: SET_INDICATOR,
    indicator,
  };
}




function requestRegions() {
  return {
    type: REQUEST_REGIONS,
  };
}

function receiveRegions(regions) {
  // console.log('regions', regions);
  return {
    type: RECEIVE_REGIONS,
    regions,
    bbox: bbox(regions.results),
    centroid: centroid(regions.results),
    receivedAt: Date.now(),
  };
}

export function fetchRegions(type) {

  const zoomlevelmapping = {
    'CADASTRE': 11,
    'DISTRICT': 9,
    'MUNICIPALITY': 3,
    'PROVINCE': 1,
    'NEIGHBOURHOOD': 10,
  };

  return dispatch => {
    dispatch(requestRegions());
    const regionEndpoint = $.ajax({
      type: 'GET',
      /* eslint-disable */
      url: `${config.apiBaseUrl}/api/v2/regions/?type=${zoomlevelmapping[type] || 3}&within_portal_bounds=true&format=json&page_size=0`,
      xhrFields: {
        withCredentials: true
      },
      /* eslint-enable */
      success: (data) => {
        return data;
      },
    });
    Promise.all([regionEndpoint]).then(([regionResults]) => {
      let regions = {};
      regions.results = regionResults
      return dispatch(receiveRegions(regions));
    });
  };
}

export function fetchRegionsIfNeeded() {
  return (dispatch) => {
    return dispatch(fetchRegions());
  };
}


export function setZoomLevel(zoomlevel) {
  return {
    type: SET_ZOOMLEVEL,
    zoomlevel,
  };
}
