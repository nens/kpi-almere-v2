import center from 'turf-centroid';
import bboxPolygon from 'turf-bbox-polygon';
import point from 'turf-point';
import styles from './PerformanceIndicator.css';
import config from '../config.jsx';
import React, { Component, PropTypes } from 'react';
import getColor from '../lib/getColor.jsx';
import moment from 'moment';
import lizardImage from './lizard.png';
import { defineMessages, FormattedMessage } from 'react-intl';
import {
  Label,
  Panel,
  Button,
} from 'react-bootstrap';
import * as d3 from 'd3';
import VisualisationSettings from './VisualisationSettings.jsx';
import {
  Area,
  Bar,
  ComposedChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  setDaterange,
  selectIndicator,
} from '../actions.jsx';

const messages = defineMessages({
  showvalues: {
    id: 'performanceindicator.showvalues',
    defaultMessage: 'Show values',
  },
});

class ReferenceLabel extends Component {
  render() {
    const { x, y, stroke, payload, referenceVal } = this.props;
    return (
      <text fill={'red'} x={0} y={( y - 5 )}>
        Referentiewaarde ({referenceVal})
      </text>
    );
  }
}

class PerformanceIndicator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showValues: false,
      showBackside: false,
      open: false,
    };
    this._handleClick = this._handleClick.bind(this);
    this._handleSelectPi = this._handleSelectPi.bind(this);
    this._handleCogClick = this._handleCogClick.bind(this);
  }

  componentDidMount() {
  }

  _handleClick() {
    this.setState({
      showValues: !this.state.showValues,
    });
  }

  _handleSelectPi(indicator) {
    this.props.selectPi(indicator);
  }

  _handleCogClick() {
    this.setState({
      showBackside: !this.state.showBackside,
    });
  }

  render() {

    const order = this.props.order;
    const openRegister = this.props.openRegister;

    let linedata = this.props.indicator.series.map((item) => {
      const formattedDate = moment(item.date).format('DD-MM-YYYY');
      return { time: formattedDate, value: item.value, score: item.score };
    });

    let interval = -12; // 3 months back by default
    switch (this.props.indicators.daterange) {
    case '1Y':
      interval = -12;
      break;
    case '3Y':
      interval = -36;
      break;
    case '5Y':
      interval = -60;
      break;
    }

    const lastDate = new Date(linedata[linedata.length - 1].time);
    const timeBack = d3.time.month.offset(lastDate, interval);

    const lastScore = linedata[linedata.length - 1].score;
    const lastValue = linedata[linedata.length - 1].value;

    linedata = linedata.filter((linedataItem) => {
      if (new Date(linedataItem.time) >= timeBack && new Date(linedataItem.time) <= lastDate) {
        return linedataItem;
      }
      return false;
    });
    const visualisationOrBackside = (this.state.showBackside) ?
      <div>
        <VisualisationSettings
          handleCogClick={this._handleCogClick}
          indicator={this.props.indicator}
          {...this.props} />
      </div>
      :
      <ResponsiveContainer>
        {(this.state.showValues) ?
        <ComposedChart
          data={linedata}
          margin={{ top: 15, right: -30, left: -40, bottom: 0 }}>
          <XAxis
            dataKey='time'
            tickFormatter={(tick) => {
              const d = new Date(tick);
              const options = {
                year: '2-digit',
                month: 'short',
              };
              return `${d.toLocaleDateString('nl-NL', options)}`;
            }}
          />
         <YAxis
           yAxisId='right'
           orientation='right'
           padding={{ bottom: 10 }}
         />
         <Tooltip />
         <Bar
            type='monotone'
            yAxisId='right'
            isAnimationActive={false}
            dataKey='value'
            barSize={4}
            fill='#413ea0' />
         <ReferenceLine
           alwaysShow={true}
           label={
             <ReferenceLabel referenceVal={this.props.indicator.referenceValue} />
           }
           isFront={true}
           stroke='red'
           strokeDasharray='3 3'
           y={this.props.indicator.referenceValue}
           yAxisId='right'
         />
        </ComposedChart>
          :
        <ComposedChart
          data={linedata}
          margin={{ top: 10, right: -30, left: -40, bottom: 0 }}>
          <XAxis dataKey='time' tickFormatter={(tick) => {
            const d = new Date(tick);
            const options = {
              year: '2-digit',
              month: 'short',
            };
            return `${d.toLocaleDateString('nl-NL', options)}`;
          }} />
         <YAxis
           yAxisId='left'
           domain={[1, 10]}
           padding={{ bottom: 10 }}
         />
         <Tooltip />
           <Area
             type='monotone'
             yAxisId='left'
             dataKey='score'
             fill='#82ca9d'
             isAnimationActive={false}
             dot={false}
          />
        </ComposedChart>
        }
      </ResponsiveContainer>;

    // Should be replaced with 'location.href' to make it dynamic:
    const baseUrl = `${config.apiBaseUrl}/`;

    const zoom = '11';
    const spatialbounds = this.props.bootstrap.bootstrap.spatial_bounds;

    // Convert bbox to bboxpoly using Turf.js
    const bboxPoly = bboxPolygon([spatialbounds[0], spatialbounds[1], spatialbounds[2], spatialbounds[3]]);
    // Then get the center of that bboxPolygon and extract its lat/lng
    const lat = center(bboxPoly).geometry.coordinates[1];
    const lng = center(bboxPoly).geometry.coordinates[0];

    const currentYear = moment(lastDate).format('YYYY');
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
    const toDate = moment(lastDate).format('MMM,DD,YYYY');

    const eventSeriesUrl = this.props.indicator.eventSeries;
    const eventUuid = eventSeriesUrl.split('/')[6].split('-')[0];
    const layerFragment = 'topography,eventseries$' + eventUuid;

    const dynamicLizardLink = `${baseUrl}nl/map/${layerFragment}/point@${lat},${lng},${zoom}/${fromDate}-${toDate}`;

    const header = (
        <div
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
              this.props.selectPi(order)
            }}
            bsSize='xsmall'>
              <i className={(openRegister[order]) ? 'fa fa-chevron-up' : 'fa fa-chevron-down'}></i>
          </Button>&nbsp;
          <span className='pull-right'>
            <Label style={{
              fontSize: '0.95em',
              backgroundColor: (lastScore > this.props.indicator.referenceValue) ? 'red' : getColor(lastScore),
            }}>
              {Math.round(lastScore)}
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
          <span className={styles.PiTitle}>
          {this.props.indicator.name}</span>
        </div>
      );

    return (
      <Panel
        collapsible
        expanded={openRegister[order]}
        bsStyle={(this.props.indicator.selected) ? 'primary' : 'default'}
        header={header}>
        <div style={{ 'float': 'right' }}>
          <input onClick={this._handleClick}
                 className={styles.showValuesCheckbox}
                 type='checkbox'
                 value='None'
                 id={this.props.pid}
                 name='check' />
          <label className={styles.showValuesLabel} htmlFor={this.props.pid}>
            <FormattedMessage {...messages.showvalues}>{(message) => <span>{message}</span>}</FormattedMessage>
          </label>
          &nbsp;&nbsp;
        </div>
          <ul className='list-unstyled list-inline' style={{ cursor: 'pointer' }}>
            <li><i className='fa fa-cog'
                   onClick={this._handleCogClick}></i>
            </li>
            {
              ['5Y', '3Y', '1Y'].map((range, i) => {
                return <li
                          key={i}
                          style={{
                            fontWeight: (this.props.indicators.daterange === range) ? 'bold' : '',
                          }}
                          onClick={() => this.props.dispatch(setDaterange(range))}>{range}
                        </li>;
              })
            }
          </ul>
          <div style={{ height: 200 }}>
            {visualisationOrBackside}
          </div>
      </Panel>
    );
  }
}

PerformanceIndicator.propTypes = {
  bootstrap: PropTypes.any,
  dispatch: PropTypes.func,
  indicator: PropTypes.any,
  indicators: PropTypes.any,
  pid: PropTypes.number,
  selectPi: PropTypes.any,
  values: PropTypes.array,
};

export default PerformanceIndicator;
