import Pimap from './PiMap.jsx';
import { connect } from 'react-redux';
import {
  fetchRegions,
  fetchPisIfNeeded,
  fetchRegionsifNeeded,
  setZoomLevel,
  setRegion,
  setIndicator,
} from '../actions.jsx';
import PerformanceIndicatorList from './PerformanceIndicatorList.jsx';
import BoundaryTypeSelect from './BoundaryTypeSelect.jsx';
import styles from './App2.css';
import React, { Component, PropTypes } from 'react';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this._selectPi = this._selectPi.bind(this);
    this._selectRegion = this._selectRegion.bind(this);
    this._selectZoomLevel = this._selectZoomLevel.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(fetchRegionsifNeeded());
    this.props.dispatch(fetchPisIfNeeded());
  }

  _selectRegion(region) {
    this.props.dispatch(setRegion(region));
  }

  _selectZoomLevel(zoomlevel) {
    this.props.dispatch(setZoomLevel(zoomlevel));
    this.props.dispatch(fetchRegions(zoomlevel));
  }

  _selectPi(indicator) {
    // console.log('coloring', indicator, 'on the map');
    this.props.dispatch(setIndicator(indicator));
  }

  render() {
    return (
      <div>
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          padding: 20,
          backgroundColor: '#353535',
          zIndeX: 99999,
        }}>
          {(this.props.region) ? this.props.region.properties.name : 'Selecteer regio'} / {(this.props.indicator) ?
          this.props.indicator.name : 'Selecteer indicator'}
        </div>

      <div style={{
        display: 'flex',
        height: '100%',
      }}>
        <div className={styles.FlexContainerWrap}>
            <div className={styles.FlexContainer} style={{ height: window.innerHeight }}>
             <Pimap
                 selectedZoomLevel={this.props.zoomlevel}
                 selectRegion={this._selectRegion}
                 selectedRegion={this.props.region}
                 regions={this.props.regions}
                 indicator={this.props.indicator}
                 indicators={this.props.indicators}
               />
            </div>
        </div>

        <aside className={styles.Sidebar}>
          <BoundaryTypeSelect
            selectZoomLevel={this._selectZoomLevel}
            selectedZoomLevel={this.props.zoomlevel}
            zoomlevels={this.props.zoomlevels} />
          <PerformanceIndicatorList
            dispatch={this.props.dispatch}
            selectedIndicator={this.props.indicator}
            selectedZoomLevel={this.props.zoomlevel}
            selectPi={this._selectPi}
            region={this.props.region}
            data={this.props.indicators}
          />
        </aside>
      </div>
      </div>
    );
  }
}

App.propTypes = {
  data: PropTypes.object,
  dispatch: PropTypes.func,
  indicator: PropTypes.any,
  indicators: PropTypes.any,
  region: PropTypes.any,
  regions: PropTypes.any,
  username: PropTypes.string,
  zoomlevel: PropTypes.any,
  zoomlevels: PropTypes.any,
};

function mapStateToProps(state) {
  // This function maps the Redux state to React Props.
  const { pis } = state;

  return {
    'indicators': pis.piData,
    'indicator': pis.indicator,
    'regions': pis.regions,
    'region': pis.region,
    'zoomlevels': pis.zoomlevels,
    'zoomlevel': pis.zoomlevel,
  };
}

export default connect(mapStateToProps)(App);
