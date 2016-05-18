import { combineReducers } from 'redux';
import {
  REQUEST_PIS,
  RECEIVE_PIS,
  REQUEST_REGIONS,
  RECEIVE_REGIONS,
} from './actions.jsx';

function pis(state = {
  isFetching: false,
  didInvalidate: false,
  piData: [],
  regions: [],
}, action) {

  console.log('reducer pis() was called with state', state, 'and action', action);

  switch (action.type) {
  case REQUEST_PIS:
    console.log('REQUEST_PIS was triggered');
    return Object.assign({}, state, {
      isFetching: true,
    });
  case RECEIVE_PIS:
    console.log('RECEIVE_PIS was triggered');
    return Object.assign({}, state, {
      isFetching: false,
      piData: action.piData,
      zoomlevels: action.zoomlevels,
    });
  case REQUEST_REGIONS:
    console.log('REQUEST_REGIONS');
    return Object.assign({}, state, {
      isFetching: true,
    });
  case RECEIVE_REGIONS:
    console.log('RECEIVE_REGIONS');
    return Object.assign({}, state, {
      isFetching: false,
      regions: action.regions,
    });
  default:
    return state;
  }
}

const rootReducer = combineReducers({
  pis,
});

export default rootReducer;
