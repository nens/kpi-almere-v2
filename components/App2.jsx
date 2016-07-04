import Pimap from './PiMap.jsx';
import { connect } from 'react-redux';
import {
  fetchIndicatorsIfNeeded,
  fetchRegionsIfNeeded,
  setZoomLevel,
  setRegion,
  selectIndicator,
} from '../actions.jsx';
import { Grid, Row, Col, Clearfix, } from 'react-bootstrap';
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
  }

  render() {
    return (
      <Grid fluid={true}>
        <Row>
          <Col md={10}>
            <h2 style={{
                fontFamily: '"Lato", "sans-serif"',
                fontWeight: '100',
              }}>
              PI Dashboard
            </h2>
          </Col>
          <Col md={2}>
            <BoundaryTypeSelect
              selectZoomLevel={this._selectZoomLevel}
              selectedZoomLevel={this.props.zoomlevel}
              zoomlevels={this.props.zoomlevels}
            />
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <PerformanceIndicatorList
              dispatch={this.props.dispatch}
              selectedIndicator={this.props.indicator}
              selectedZoomLevel={this.props.zoomlevel}
              selectPi={this._selectPi}
              region={this.props.region}
              indicators={this.props.indicators}
            />
          </Col>
          <Col md={6}>
            <BoundaryTypeSelect
              selectZoomLevel={this._selectZoomLevel}
              {...this.props}
            />
            <Pimap
                selectedZoomLevel={this.props.zoomlevel}
                selectRegion={this._selectRegion}
                selectedRegion={this.props.region}
                regions={this.props.regions}
                indicator={this.props.indicator}
                indicators={this.props.indicators}
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
  return {'indicators': state.indicators};
}

export default connect(mapStateToProps)(App);
