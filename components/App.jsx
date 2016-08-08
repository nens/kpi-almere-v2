const logo = require('./logo.png');
const loadingIndicator = require('./loading.svg');
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import { Button, Grid, Row, Col, Label, Modal } from 'react-bootstrap';
import Pimap from './PiMap.jsx';
import PerformanceIndicatorList from './PerformanceIndicatorList.jsx';
import BoundaryTypeSelect from './BoundaryTypeSelect.jsx';
import NotificationSystem from 'react-notification-system';

import {
  fetchIndicatorsIfNeeded,
  fetchRegionsIfNeeded,
  fetchRegions,
  setZoomLevel,
  setRegion,
} from '../actions.jsx';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showInfo: false,
    };
    this._selectRegion = this._selectRegion.bind(this);
    this._selectZoomLevel = this._selectZoomLevel.bind(this);
    this.openInfo = this.openInfo.bind(this);
    this.closeInfo = this.closeInfo.bind(this);
    this._addNotification = this._addNotification.bind(this);
    this._notificationSystem = null;
  }

  componentDidMount() {
    this._notificationSystem = this.refs.notificationSystem;
    this.props.dispatch(fetchIndicatorsIfNeeded());
    this.props.dispatch(fetchRegionsIfNeeded());
  }

  componentWillReceiveProps(newProps) {
    if (newProps.indicators.errormessage) {
      this._addNotification(newProps.indicators.errormessage.message, newProps.indicators.errormessage.level);
    }
  }

  _addNotification(message, level) {
    this._notificationSystem.addNotification({
      message,
      level,
    });
  }

  openInfo() {
    this.setState({ showInfo: true });
  }

  closeInfo() {
    this.setState({ showInfo: false });
  }

  _selectRegion(region) {
    this.props.dispatch(setRegion(region));
  }

  _selectZoomLevel(zoomlevel) {
    this.props.dispatch(setZoomLevel(zoomlevel));
    this.props.dispatch(fetchRegions(zoomlevel));
  }

  render() {
    return (
      <div>
      <Grid>
        <Row>
          <Col md={12}>
            <div
              style={{
                margin: '10px 0px 0 0',
              }}
              className='pull-right'>
              <Button
                onClick={this.openInfo}
                bsSize='xsmall'
                className='pull-right'>
                <i className='fa fa-info-circle'></i>&nbsp;Informatie
              </Button>
              <br/>
              <h3 style={{
                fontFamily: '"Lato", "sans-serif"',
                fontWeight: '100',
              }}>Dashboard Prestatieindicatoren</h3>
            </div>
            <img src={logo} style={{ width: 150, padding: '10px 0 0 0' }} />
               {(this.props.indicators.isFetching) ? <img src={loadingIndicator}/> : ''}
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <h4>
              <Label bsStyle='info'>
              Geselecteerd:&nbsp;
              {(this.props.indicators.region) ? this.props.indicators.region.properties.name : ''}
              </Label>
            </h4>
          </Col>
          <Col md={6}>
            <BoundaryTypeSelect
              selectZoomLevel={this._selectZoomLevel}
              {...this.props}
            />
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <PerformanceIndicatorList
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

      <Modal
        show={this.state.showInfo}
        onHide={this.closeInfo}>
        <Modal.Header closeButton>
          <Modal.Title>
            Gemeente Almere Performanceindicator Dashboard
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
          labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
           nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
           velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
           proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.closeInfo}>Sluiten</Button>
        </Modal.Footer>
      </Modal>

      <NotificationSystem ref="notificationSystem" />
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
  return { 'indicators': state.indicators };
}

export default connect(mapStateToProps)(App);
