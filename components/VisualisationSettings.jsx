import styles from './VisualisationSettings.css';
import { Grid, Row, Col, Label, Button, ButtonToolbar, ButtonGroup }  from 'react-bootstrap';
import React, { Component, PropTypes } from 'react'

import {
  setReferenceValueForIndicator,
} from '../actions.jsx';

export default class VisualisationSettings extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.dispatch(setReferenceValueForIndicator(this.props.indicator.id, e.target.value));
  }

  render() {
    return (
      <div style={{ height: 280 }}>
        <div className="form-group">
          <label labelFor="exampleInputEmail1">Referentiewaarde</label>
          <input type="number"
                 min="0"
                 className="form-control"
                 onChange={this.handleChange}
                 value={this.props.indicator.referenceValue}
                 id="exampleInputEmail1"
                 placeholder=""/>
               <br/>
               <div className="pull-right"><Button onClick={this.props.handleCogClick}>OK</Button></div>
        </div>
      </div>
    );
  }
}

VisualisationSettings.propTypes = {}
