import guid from './lib/guid.jsx';
import { combineReducers } from 'redux';
import {
  RECEIVE_INDICATORS,
  RECEIVE_REGIONS,
  REQUEST_INDICATORS,
  REQUEST_REGIONS,
  SELECT_INDICATOR,
  SET_DATERANGE_FOR_PI,
  SET_REGION,
  SET_INDICATOR,
} from './actions.jsx';

function indicators(state = {
  isFetching: false,
  didInvalidate: false,
  piData: [],
  regions: [],
  indicators: [],
  zoomlevel: 'DISTRICT',
}, action) {
  // console.log('reducer indicators() was called with state', state, 'and action', action);
  switch (action.type) {
  case SET_DATERANGE_FOR_PI:
    return Object.assign({}, state, {
      indicators: state.indicators.map((item) => {
        return {
          name: item.name,
          regions: item.regions.map((region) => {
            if (region.id === action.selectedIndicatorItem.id && region.active === true) {
              region.daterange = action.rangeType;
            }
            return region;
          }),
        };
      }),
    });
  case SELECT_INDICATOR:
    return Object.assign({}, state, {
      indicators: state.indicators.map((item) => {
        return {
          name: item.name,
          regions: item.regions.map((region) => {
            if (region.id === action.indicator.id) {
              region.selected = true;
              return region;
            }
            region.selected = false;
            return region;
          }),
        };
      }),
    });
  case SET_REGION:
    return Object.assign({}, state, {
      region: action.region,
    });
  case SET_INDICATOR:
    return Object.assign({}, state, {
      indicator: action.indicator,
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
  case REQUEST_INDICATORS:
    return Object.assign({}, state, {
      isFetching: true,
    });
  case RECEIVE_INDICATORS:
    return Object.assign({}, state, {
      isFetching: false,
      indicators: action.piData.map((item) => {
        return {
          name: item[0].name,
          regions: item[1].regions.map((region) => {
            const splittedRegionUrl = region.region_url.split('/');
            const regionId = Number(splittedRegionUrl[splittedRegionUrl.length - 2]);
            return {
              name: item[0].name,
              id: guid(),
              aggregationPeriod: item[0].aggregation_period,
              boundaryTypeId: item[0].boundary_type_id,
              boundaryTypeName: item[0].boundary_type_name,
              referenceValue: item[0].reference_value,
              regionName: region.region_name,
              regionUrl: region.region_url,
              regionId,
              series: region.aggregations,
              daterange: '3M',
            };
          }),
        };
      }),
      zoomlevels: action.zoomlevels,
    });
  default:
    return state;
  }
}

const rootReducer = combineReducers({
  indicators,
});

export default rootReducer;
