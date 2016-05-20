import Stats from './Stats.jsx';
import Pimap from './PiMap.jsx';
import { connect } from 'react-redux';
import {
  fetchPisIfNeeded,
  fetchRegionsifNeeded,
  setZoomLevel,
  setRegion,
  setIndicator,
} from '../actions.jsx';

import Authentication from './Authentication.jsx';
import PerformanceIndicatorList from './PerformanceIndicatorList.jsx';
import BoundaryTypeSelect from './BoundaryTypeSelect.jsx';
import styles from './App2.css';
import { Grid, Row, Col } from 'react-bootstrap';
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
  }

  _selectPi(indicator) {
    // this.setState({
    //   selectedIndicator: indicator,
    // });
    this.props.dispatch(setIndicator(indicator));
  }

  render() {
    // console.log('App is receiving these props:', this.props);

    const selectedRegionText = (this.props.region) ?
      <span>
        <i className="fa fa-building-o"></i>&nbsp;&nbsp;{this.props.region.properties.name || 'Onbekend'}
      </span> : '';

    const selectedIndicatorText = (this.props.indicator) ?
      <span>
        <i className="fa fa-bar-chart"></i>&nbsp;&nbsp;{this.props.indicator.name || '...'}
      </span> : '';

    return (
     <Grid fluid>
        <Row className={styles.Main}>
          <Col md={8}>
            <Pimap
              selectedZoomLevel={this.props.zoomlevel}
              selectRegion={this._selectRegion}
              selectedRegion={this.props.region}
              data={this.props.regions}
            />

            <BoundaryTypeSelect
              selectZoomLevel={this._selectZoomLevel}
              selectedZoomLevel={this.props.zoomlevel}
              zoomlevels={this.props.zoomlevels} />

            <Stats title={'Aantal wijken'} value={this.props.regions.count || 0} />
            <Stats title={'Aantal indicatoren'} value={this.props.indicators.length} />

            <div style={{ position: 'absolute', zIndex: 999998 }}>{selectedIndicatorText}</div>
            <div style={{ position: 'absolute', zIndex: 999999 }}>{selectedRegionText}</div>


        </Col>
        <Col md={4}>
          <PerformanceIndicatorList
            selectedZoomLevel={this.props.zoomlevel}
            selectPi={this._selectPi}
            data={this.props.indicators}
          />
        </Col>
      </Row>
    </Grid>
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
