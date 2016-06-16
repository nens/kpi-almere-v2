import { combineReducers } from 'redux';
import {
  REQUEST_PIS,
  RECEIVE_PIS,
  REQUEST_REGIONS,
  RECEIVE_REGIONS,
  SET_ZOOMLEVEL,
  SET_REGION,
  SET_INDICATOR,
  SET_REFERENCE_VALUE_FOR_INDICATOR,
} from './actions.jsx';

function pis(state = {
  isFetching: false,
  didInvalidate: false,
  piData: [],
  regions: [],
  zoomlevel: 'DISTRICT',
}, action) {
  // console.log('reducer pis() was called with state', state, 'and action', action);
  switch (action.type) {
  case SET_REFERENCE_VALUE_FOR_INDICATOR:
    return Object.assign({}, state, {
      piData: state.piData.map((item) => {
        if (item[0].name === action.indicator.name) {
          item[0].reference_value = action.value;
        }
        return item;
      }),
    });
  case REQUEST_PIS:
    return Object.assign({}, state, {
      isFetching: true,
    });
  case RECEIVE_PIS:
    return Object.assign({}, state, {
      isFetching: false,
      piData: action.piData,
      zoomlevels: action.zoomlevels,
    });
  case REQUEST_REGIONS:
    return Object.assign({}, state, {
      isFetching: true,
    });
  case RECEIVE_REGIONS:
    return Object.assign({}, state, {
      isFetching: false,
      regions: action.regions,
    });
  case SET_ZOOMLEVEL:
    return Object.assign({}, state, {
      zoomlevel: action.zoomlevel,
    });
  case SET_REGION:
    return Object.assign({}, state, {
      region: action.region,
    });
  case SET_INDICATOR:
    return Object.assign({}, state, {
      indicator: action.indicator,
    });
  default:
    return state;
  }
}

const rootReducer = combineReducers({
  pis,
});

export default rootReducer;
