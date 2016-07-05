/* globals Promise:true */
import $ from 'jquery';
import _ from 'lodash';

export const RECEIVE_INDICATORS = 'RECEIVE_INDICATORS';
export const RECEIVE_REGIONS = 'RECEIVE_REGIONS';
export const REQUEST_INDICATORS = 'REQUEST_INDICATORS';
export const REQUEST_REGIONS = 'REQUEST_REGIONS';
export const SELECT_INDICATOR = 'SELECT_INDICATOR';
export const SET_DATERANGE_FOR_PI = 'SET_DATERANGE_FOR_PI';
export const SET_INDICATOR = 'SET_INDICATOR';
export const SET_REGION = 'SET_REGION';
export const SET_ZOOMLEVEL = 'SET_ZOOMLEVEL';





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
      url: 'https://nxt.staging.lizard.net/api/v2/pi/',
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
    receivedAt: Date.now(),
  };
}

export function fetchRegions(type) {

  const zoomlevelmapping = {
    'CADASTRE': 11,
    'DISTRICT': 9,
    'MUNICIPALITY': 3,
    'PROVINCE': 1,
  };

  return dispatch => {
    dispatch(requestRegions());
    const regionEndpoint = $.ajax({
      type: 'GET',
      /* eslint-disable */
      url: `https://nxt.staging.lizard.net/api/v2/regions/?type=${zoomlevelmapping[type] || 9}&within_portal_bounds=true&format=json`,
      xhrFields: {
        withCredentials: true
      },
      /* eslint-enable */
      success: (data) => {
        return data;
      },
    });
    Promise.all([regionEndpoint]).then(([regionResults]) => {
      return dispatch(receiveRegions(regionResults));
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
