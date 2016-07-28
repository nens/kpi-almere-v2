const logo = require('./logo.png');
const loadingIndicator = require('./loading.svg');
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import { Button, Grid, Row, Col, Label } from 'react-bootstrap';
import Pimap from './PiMap.jsx';
import PerformanceIndicatorList from './PerformanceIndicatorList.jsx';
import BoundaryTypeSelect from './BoundaryTypeSelect.jsx';

import {
  fetchIndicatorsIfNeeded,
  fetchRegionsIfNeeded,
  fetchRegions,
  setZoomLevel,
  setRegion,
  selectIndicator,
} from '../actions.jsx';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this._selectPi = this._selectPi.bind(this);
    this._selectRegion = this._selectRegion.bind(this);
    this._selectZoomLevel = this._selectZoomLevel.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(fetchIndicatorsIfNeeded());
    this.props.dispatch(fetchRegionsIfNeeded());
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
    this.props.dispatch(selectIndicator(indicator));
    this.props.dispatch(fetchRegions(this.props.zoomlevel));
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col md={6}>
            <div
              style={{
                margin: '10px 0px 0 0',
              }}
              className='pull-right'><h3>Dashboard Prestatieindicatoren</h3>
            <Button bsSize='xsmall' className='pull-right'>
              <i className='fa fa-info-circle'></i>&nbsp;Informatie
              </Button>
            </div>
            <h2 style={{
              fontFamily: '"Lato", "sans-serif"',
              fontWeight: '100',
            }}>
            <img src={logo} style={{ width: 150}} />
               {(this.props.indicators.isFetching) ? <img src={loadingIndicator}/> : ''}

            </h2>
          </Col>
          <Col md={6}>
            <BoundaryTypeSelect
              selectZoomLevel={this._selectZoomLevel}
              {...this.props}
            />
            <div>
            <h4>
              <Label>
              Geselecteerd:&nbsp;
              {(this.props.indicators.region) ? this.props.indicators.region.properties.name : ''}
            </Label></h4>
            </div>

          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <PerformanceIndicatorList
              selectPi={this._selectPi}
              {...this.props}
            />
          </Col>
          <Col md={6}>
            <Pimap
              selectRegion={this._selectRegion}
              {...this.props}
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
  return { 'indicators': state.indicators };
}

export default connect(mapStateToProps)(App);
