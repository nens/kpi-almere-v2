// @flow
import config from '../config.jsx';
const loadingIndicator = require('./loading.svg');
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import {
  Button,
  ButtonGroup,
  Grid,
  Row,
  Col,
  Label,
  Modal,
} from 'react-bootstrap';
import Pimap from './PiMap.jsx';
import PerformanceIndicatorList from './PerformanceIndicatorList.jsx';
import BoundaryTypeSelect from './BoundaryTypeSelect.jsx';
import NotificationSystem from 'react-notification-system';
import { defineMessages, FormattedMessage } from 'react-intl';

import {
  clearMapSelection,
  fetchApplicationBootstrap,
  fetchIndicatorsIfNeeded,
  fetchRegionsIfNeeded,
  fetchRegions,
  setZoomLevel,
  setRegion,
} from '../actions.jsx';

const messages = defineMessages({
  selected: {
    id: 'app.selected',
    defaultMessage: 'Selected',
  },
  apptitle: {
    id: 'app.apptitle',
    defaultMessage: 'Dashboard Performance Indicators',
  },
  areYouSure: {
    id: 'app.areyousure',
    defaultMessage: 'Are you sure?',
  },
  areYouSureConfirm: {
    id: 'app.areyousureconfirm',
    defaultMessage: 'Yes I\'m sure',
  },
  areYouSureFull: {
    id: 'app.areyousurefull',
    defaultMessage: 'Are you sure you want to log out?',
  },
  areYouSureClose: {
    id: 'app.areyousureclose',
    defaultMessage: 'Close',
  },
  infobutton: {
    id: 'app.infobutton',
    defaultMessage: 'Information',
  },
  logoutbutton: {
    id: 'app.logoutbutton',
    defaultMessage: 'Log out',
  },
  infoModalClose: {
    id: 'app.infomodalclose',
    defaultMessage: 'Close',
  },
  infoModalBody: {
    id: 'app.infomodalbody',
    defaultMessage: 'Hier zit u het Dashboard Prestatie Indicatoren. Dit dashboard geeft inzicht in de prestaties van de operationele doelstellingen van de waterbeheerder.',
  },
  infoModalBody2: {
    id: 'app.infomodalbody2',
    defaultMessage: 'Door op een prestatie indicator te klikken, ziet u de trendlijn voor de ingesteld periode. In de titelbalk ziet u de actuele score. Op de kaart is de score per deelgebied, in kleur zichtbaar. De prestatie indicatoren zijn op drie schaalniveaus op te vragen; Gemeente, Wijk en Buurt.',
  },
  infoModalBody3: {
    id: 'app.infomodalbody3',
    defaultMessage: 'Klikt u in de titelbalk op het Lizard icoon naast de score, kunt u de onderliggende data inzien waaruit de prestatie indicatoren is opgebouwd.',
  },
  infoModalTitle: {
    id: 'app.infomodaltitle',
    defaultMessage: 'Information',
  },
});

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showInfo: false,
      showLogout: false,
    };
    this._selectRegion = this._selectRegion.bind(this);
    this._selectZoomLevel = this._selectZoomLevel.bind(this);
    this.openInfo = this.openInfo.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.closeLogoutModal = this.closeLogoutModal.bind(this);
    this.closeInfo = this.closeInfo.bind(this);
    this.handleClearSelection = this.handleClearSelection.bind(this);
    this.handleRedirectToLogout = this.handleRedirectToLogout.bind(this);
    this._addNotification = this._addNotification.bind(this);
    this._notificationSystem = null;
  }

  componentDidMount() {
    this._notificationSystem = this.refs.notificationSystem;
    this.props.dispatch(fetchIndicatorsIfNeeded());
    this.props.dispatch(fetchRegionsIfNeeded());
    this.props.dispatch(fetchApplicationBootstrap());
  }

  componentWillReceiveProps(newProps) {

    if (newProps.indicators.errormessage) {
      this._addNotification(
        newProps.indicators.errormessage.message,
        newProps.indicators.errormessage.level
      );
    }
  }

  _addNotification(message, level) {
    this._notificationSystem.addNotification({
      message,
      level,
    });
  }

  handleClearSelection() {
    this.props.dispatch(clearMapSelection());
  }

  openInfo() {
    this.setState({ showInfo: true });
  }

  handleLogout() {
    this.setState({ showLogout: true });
  }

  closeInfo() {
    this.setState({ showInfo: false });
  }

  closeLogoutModal() {
    this.setState({ showLogout: false });
  }

  handleRedirectToLogout() {
    window.location.href = '/accounts/logout/';
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
              <ButtonGroup>
                <Button
                  onClick={this.openInfo}
                  bsSize='xsmall'>
                  <i className='fa fa-info-circle'></i>&nbsp;
                  <FormattedMessage {...messages.infobutton} />
                </Button>
                <Button
                  onClick={this.handleLogout}
                  bsSize='xsmall'>
                  <i className='fa fa-sign-out'></i>&nbsp;
                  <FormattedMessage {...messages.logoutbutton} />
                </Button>
              </ButtonGroup>
            </div>
            <h3 style={{
              fontFamily: '"Lato", "sans-serif"',
              fontWeight: '100',
            }}><FormattedMessage {...messages.apptitle} />
            {(this.props.indicators.isFetching) ?
              <img src={loadingIndicator}/> : ''}
            </h3>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <h4>
              <Label bsStyle='info'>
              <FormattedMessage {...messages.selected} />:&nbsp;&nbsp;
              {(this.props.indicators.region) ?
                `${this.props.indicators.region.properties.name}` : '---'}&nbsp;
              {(this.props.indicators.region) ?
                <i style={{ cursor: 'pointer' }}
                   onClick={this.handleClearSelection}
                   className='fa fa-times'></i> : ''}
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
            <FormattedMessage {...messages.infoModalTitle} />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormattedMessage {...messages.infoModalBody} tagName='p' />
          <FormattedMessage {...messages.infoModalBody2} tagName='p' />
          <FormattedMessage {...messages.infoModalBody3} tagName='p' />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.closeInfo}>
            <FormattedMessage {...messages.infoModalClose} />
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={this.state.showLogout}
        onHide={this.closeLogoutModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            <FormattedMessage {...messages.areYouSure} />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormattedMessage {...messages.areYouSureFull} tagName='p' />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleRedirectToLogout}>
            <FormattedMessage {...messages.areYouSureConfirm} />
          </Button>
          <Button onClick={this.closeLogoutModal}>
            <FormattedMessage {...messages.areYouSureClose} />
          </Button>
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
  return {
    'bootstrap': state.bootstrap,
    'indicators': state.indicators,
  };
}

export default connect(mapStateToProps)(App);
