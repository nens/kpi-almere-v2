import Stats from './Stats.jsx';
import Map from './Map.jsx';
import { connect } from 'react-redux';
import {
  fetchPisIfNeeded,
  fetchRegionsifNeeded,
  setZoomLevel,
  setRegion,
} from '../actions.jsx';

import Authentication from './Authentication.jsx';
import PerformanceIndicatorList from './PerformanceIndicatorList.jsx';
import BoundaryTypeSelect from './BoundaryTypeSelect.jsx';
import styles from './App2.css';
import { Grid, Row, Col } from 'react-bootstrap';
import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRegion: '',
      selectedIndicator: '',
      selectedZoomLevel: 'DISTRICT',
    };
    this._selectPi = this._selectPi.bind(this);
    this._selectRegion = this._selectRegion.bind(this);
    this._selectZoomLevel = this._selectZoomLevel.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(fetchRegionsifNeeded());
    this.props.dispatch(fetchPisIfNeeded());
  }

  _selectRegion(region) {
    // this.setState({
    //   selectedRegion: region,
    // });
    this.props.dispatch(setRegion(region));
  }

  _selectZoomLevel(zoomlevel) {
    this.props.dispatch(setZoomLevel(zoomlevel));
  }

  _selectPi(indicator) {
    // this.props.dispatch(requestPis());
    this.setState({
      selectedIndicator: indicator,
    });
  }

  render() {
    // console.log('App is receiving these props:', this.props);

    const selectedRegionText = (this.props.region) ?
      <span><i className="fa fa-building-o"></i>&nbsp;&nbsp;{this.props.region.properties.name || 'Onbekend'}</span> : '';

    const selectedIndicatorText = (this.state.selectedIndicator) ?
      <span><i className="fa fa-bar-chart"></i>&nbsp;&nbsp;{this.state.selectedIndicator.name || '...'}</span> : '';

    return (
     <Grid fluid>
        <Row>
          <Col md={11}/>
          <Col md={1}>
            <Authentication username={this.props.username} />
          </Col>
        </Row>
        <Row className={styles.Main}>
          <Col md={8}>
            <BoundaryTypeSelect
              selectZoomLevel={this._selectZoomLevel}
              selectedZoomLevel={this.props.zoomlevel}
              zoomlevels={this.props.zoomlevels} />

            <Stats title={'Aantal wijken'} value={this.props.regions.count || 0} />
            <Stats title={'Aantal indicatoren'} value={this.props.indicators.length} />

            <div>{selectedIndicatorText}</div>
            <div>{selectedRegionText}</div>

            <Map
              selectedZoomLevel={this.props.zoomlevel}
              selectRegion={this._selectRegion}
              selectedRegion={this.props.region}
              data={this.props.regions}
            />
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
  username: PropTypes.string,
};

function mapStateToProps(state) {
  // This function maps the Redux state to React Props.
  const { pis } = state;

  return {
    'indicators': pis.piData,
    'regions': pis.regions,
    'region': pis.region,
    'zoomlevels': pis.zoomlevels,
    'zoomlevel': pis.zoomlevel,
  };
}

export default connect(mapStateToProps)(App);
