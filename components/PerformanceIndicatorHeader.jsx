import bboxPolygon from 'turf-bbox-polygon';
import center from 'turf-centroid';
import config from '../config.jsx';
import getColor from '../lib/getColor.jsx';
import lizardImage from './lizard.png';
import moment from 'moment';
import React, { Component, PropTypes } from 'react';

import styles from './PerformanceIndicatorHeader.css';
import {
  Label,
  Panel,
  Button,
} from 'react-bootstrap';

import {
  setDaterange,
  selectIndicator,
} from '../actions.jsx';


class PerformanceIndicatorHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {

  }

  render() {
    // Should be replaced with 'location.href' to make it dynamic:
    const baseUrl = `${config.apiBaseUrl}/`;

    const zoom = '11';
    const spatialbounds = this.props.bootstrap.bootstrap.spatial_bounds;

    // Convert bbox to bboxpoly using Turf.js
    const bboxPoly = bboxPolygon([
      spatialbounds[0],
      spatialbounds[1],
      spatialbounds[2],
      spatialbounds[3]
    ]);
    // Then get the center of that bboxPolygon and extract its lat/lng
    const lat = center(bboxPoly).geometry.coordinates[1];
    const lng = center(bboxPoly).geometry.coordinates[0];

    const currentYear = moment(this.props.lastDate).format('YYYY');
    let tempFromDate;
    switch (this.props.indicators.daterange) {
    case '3Y':
      tempFromDate = Number(currentYear) - 3;
      break;
    case '5Y':
      tempFromDate = Number(currentYear) - 5;
      break;
    default:
      tempFromDate = Number(currentYear) - 1;
      break;
    }
    const fromDate = `Jan,01,${tempFromDate}`;
    const toDate = moment(this.props.lastDate).format('MMM,DD,YYYY');

    const eventSeriesUrl = this.props.indicator.eventSeries;
    const eventUuid = eventSeriesUrl.split('/')[6].split('-')[0];
    const layerFragment = 'topography,eventseries$' + eventUuid;

    const dynamicLizardLink = `${baseUrl}nl/map/${layerFragment}/point@${lat},${lng},${zoom}/${fromDate}-${toDate}`;

    return (
      <div
          id='pi'
          className='pi'
          onClick={() => {
            this.props.dispatch(selectIndicator(this.props.indicator));
          }}
          style={{
            cursor: 'pointer',
            fontWeight: (this.props.indicator.selected) ? 'bold' : '',
          }}>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            this.props.selectPi(this.props.order)
          }}
          bsSize='xsmall'>
            <i className={(this.props.openRegister[this.props.order]) ?
              'fa fa-chevron-up' : 'fa fa-chevron-down'}></i>
        </Button>&nbsp;
        <span className='pull-right'>
          <Label style={{
            fontSize: '0.95em',
            backgroundColor: getColor(this.props.lastScore),
          }}>
            {Math.round(this.props.lastScore)}
          </Label>
          <span
               onClick={(e) => {
                 e.stopPropagation();
                 window.open(dynamicLizardLink, '_blank')
               }}>
              <img
                width='20'
                style={{ margin: '0px 0px 5px 5px' }}
                src={lizardImage}
              />
            </span>
        </span>
        <span>
        {this.props.indicator.name}</span>
      </div>
    )
  }
}


PerformanceIndicatorHeader.propTypes = {};

export default PerformanceIndicatorHeader;
