import styles from './VisualisationSettings.css';
import { Alert, Grid, Row, Col, Label, Button, ButtonToolbar, ButtonGroup }  from 'react-bootstrap';
import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { defineMessages, FormattedMessage } from 'react-intl';

import {
  setReferenceValueForIndicator,
} from '../actions.jsx';

const messages = defineMessages({
  helptext: {
    id: 'visualisationsettings.helptext',
    defaultMessage: 'You can set a reference value here if you have administrative privileges.',
  },
  referencevalue: {
    id: 'visualisationsettings.referencevalue',
    defaultMessage: 'Reference value',
  },
  currentreferencevalue: {
    id: 'visualisationsettings.currentreferencevalue',
    defaultMessage: 'Current Reference value',
  },
  applyRefvalButton: {
    id: 'visualisationsettings.applyrefvalbutton',
    defaultMessage: 'Apply',
  },
  closeRefvalButton: {
    id: 'visualisationsettings.closerefvalbutton',
    defaultMessage: 'Close',
  },
});


export default class VisualisationSettings extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleChange() {
    // const selection1 = _.filter(this.props.indicators.indicators, { regions: [{ selected: true }] });
    // console.log('---->', selection1);
    // const indicatorIdTemp = this.props.indicator.url.split('/');
    // const indicatorId = indicatorIdTemp[indicatorIdTemp.length - 2];
    // console.log(this.props);
    const indicatorId = 1;
    this.props.dispatch(setReferenceValueForIndicator(indicatorId, this.refs.refval.value));
  }

  handleClose() {
    this.props.handleCogClick();
  }

  render() {
    const currentRefVal = this.props.indicator.referenceValue;
    return (
      <div style={{ height: 280 }}>
        <Alert>
          <FormattedMessage {...messages.helptext} />
        </Alert>
        <div className="form-group">
          <label><FormattedMessage {...messages.currentreferencevalue} /></label>: {currentRefVal}
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1"><FormattedMessage {...messages.referencevalue} /></label>
          <input type="number"
                 min="0"
                 ref='refval'
                 className="form-control"
                 defaultValue={this.props.indicator.referenceValue}
                 id="exampleInputEmail1"
                 placeholder=""/>
               <br/>
               <div className="pull-right">
                 <ButtonGroup>
                   <Button onClick={this.handleChange}><FormattedMessage {...messages.applyRefvalButton} /></Button>
                   <Button onClick={this.handleClose}><FormattedMessage {...messages.closeRefvalButton} /></Button>
                 </ButtonGroup>
               </div>
        </div>
      </div>
    );
  }
}

VisualisationSettings.propTypes = {}
