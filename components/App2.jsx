import Stats from './Stats.jsx';
import Map from './Map.jsx';
import { connect } from 'react-redux';
import { fetchPisIfNeeded, fetchRegionsifNeeded } from '../actions.jsx';

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
    this.setState({
      selectedRegion: region,
    });
  }

  _selectZoomLevel(zoomlevel) {
    this.setState({
      selectedZoomLevel: zoomlevel,
    });
  }

  _selectPi(indicator) {
    // this.props.dispatch(requestPis());
    this.setState({
      selectedIndicator: indicator,
    });
  }

  render() {

    console.log('--------->', this.props);

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
              selectedZoomLevel={this.state.selectedZoomLevel}
              zoomlevels={this.props.zoomlevels} />

            <Stats title={'Aantal wijken'} value={this.props.regions.count || 0} />
            <Stats title={'Aantal indicatoren'} value={this.props.indicators.length} />

            <div>{this.state.selectedIndicator.name}</div>
            <div>{_.get(this.state.selectedRegion, 'properties.name', '...')}</div>

            <Map
              selectedZoomLevel={this.state.selectedZoomLevel}
              selectRegion={this._selectRegion}
              selectedRegion={this.state.selectedRegion}
              data={this.props.regions}
            />
        </Col>
        <Col md={4}>
          <PerformanceIndicatorList
            selectedZoomLevel={this.state.selectedZoomLevel}
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
  const { pis } = state;

  // const {
  //   piData,
  //   regions,
  // } = pis || {
  //   isFetching: true,
  //   piData: [],
  //   regions: [],
  // };

  return {
    'indicators': pis.piData,
    'regions': pis.regions,
    'zoomlevels': pis.zoomlevels,
  };
}

export default connect(mapStateToProps)(App);
