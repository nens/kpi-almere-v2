import center from 'turf-centroid';
import bboxPolygon from 'turf-bbox-polygon';
import point from 'turf-point';
import styles from './PerformanceIndicator.css';
import config from '../config.jsx';
import React, { Component, PropTypes } from 'react';
import getColor from '../lib/getColor.jsx';
import moment from 'moment';
import $ from 'jquery';
import { defineMessages, FormattedMessage } from 'react-intl';
import {
  Label,
  Panel,
  Button,
  ButtonGroup,
  Grid,
  Row,
  Col,
  Modal,
} from 'react-bootstrap';
import * as d3 from 'd3';
import PerformanceIndicatorHeader from './PerformanceIndicatorHeader.jsx';
import ReferenceLabel from './ReferenceLabel.jsx';
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


class PerformanceIndicator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showValues: false,
      showBackside: false,
      open: false,
      showInfoModal: false,
    };
    this._handleClick = this._handleClick.bind(this);
    this._handleSelectPi = this._handleSelectPi.bind(this);
    this._handleCogClick = this._handleCogClick.bind(this);
  }

  componentDidMount() {}

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
    let linedata = this.props.indicator.series.map((item) => {
      const formattedDate = moment(item.date).format('DD-MM-YYYY');
      return {
        originaldate: item.date,
        time: formattedDate,
        value: item.value,
        score: item.score,
      };
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

    const lastDate = moment(linedata[linedata.length - 1].originaldate).toDate();
    const timeBack = d3.time.month.offset(lastDate, interval);

    const lastScore = linedata[linedata.length - 1].score;
    const lastValue = linedata[linedata.length - 1].value;

    const dateFormat = "dd - MM - YYYY";

    linedata = linedata.filter((linedataItem) => {
      if (moment(linedataItem.originaldate).toDate() >= timeBack &&
          moment(linedataItem.originaldate).toDate() <= lastDate) {
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
          margin={{ top: 15, right: 0, left: -20, bottom: 0 }}>
          <XAxis
            dataKey='time'
            tickFormatter={(tick) => {
              const d = moment(tick, dateFormat).toDate();
              const options = {
                year: '2-digit',
                month: 'short',
              };
              return `${d.toLocaleDateString('nl-NL', options)}`;
            }}
          />
         <YAxis
           yAxisId='right'
           orientation='left'
           padding={{ bottom: 10 }}
           tickFormatter={(tick) => {
             return parseFloat(tick);
           }}
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
             <ReferenceLabel
              referenceVal={this.props.indicator.referenceValue} />
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
          margin={{ top: 10, right: 0, left: -30, bottom: 0 }}>
            <XAxis dataKey='time' tickFormatter={(tick) => {
              const d = moment(tick, dateFormat).toDate();
              const options = {
                year: '2-digit',
                month: 'short',
              };
              return `${d.toLocaleDateString('nl-NL', options)}`;
            }} />
           <YAxis
             tickFormatter={(tick) => {
               return parseInt(tick);
             }}
             yAxisId='left'
             domain={[0, 10]}
             padding={{ bottom: 10 }}
             tickCount={3}
           />
           <Tooltip formatter={(value) => {
             console.log('value', value);
             return value;
           }}/>
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



    const header = <PerformanceIndicatorHeader
                    {...this.props}
                    lastData={lastDate}
                    lastScore={lastScore} />;

    return (
      <Panel
        collapsible
        expanded={this.props.openRegister[this.props.order]}
        bsStyle={(this.props.indicator.selected) ? 'primary' : 'default'}
        header={header}>
        <div style={{ 'float': 'right' }}>
          <i
            style={{
              color: '#377BB5',
              cursor: 'pointer',
            }}
            onClick={() => this.setState({ showInfoModal: true })}
            className='fa fa-info-circle'></i>&nbsp;
          <input onClick={this._handleClick}
                 className={styles.showValuesCheckbox}
                 type='checkbox'
                 value='None'
                 id={this.props.pid}
                 name='check' />
          <label className={styles.showValuesLabel} htmlFor={this.props.pid}>
            <FormattedMessage {...messages.showvalues}>
              {(message) => <span>{message}</span>}
            </FormattedMessage>
          </label>
          &nbsp;&nbsp;
        </div>
          <ul className='list-unstyled list-inline'
              style={{ cursor: 'pointer' }}>
            <li>
              <i className='fa fa-cog'
                 onClick={this._handleCogClick}></i>
            </li>
            {
              ['5Y', '3Y', '1Y'].map((range, i) => {
                return <li key={i}
                           style={{
                             fontWeight:
                               (this.props.indicators.daterange === range) ?
                                'bold' : '',
                            }}
                            onClick={() =>
                              this.props.dispatch(setDaterange(range))}>
                              {range}
                        </li>;
              })
            }
          </ul>
          <div style={{ height: 200 }}>
            {visualisationOrBackside}
          </div>
          <Modal
            show={this.state.showInfoModal}
            onHide={() => this.setState({ showInfoModal: false })}>
            <Modal.Header closeButton>
              <Modal.Title>
                Informatie
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <strong>In dit venster is informatie opgenomen over de prestatie indicator. In de titelbalk is informatie opgenomen met achtereenvolgens:</strong><br/><br/>
              <ul>
              <li>Naamgeving van de prestatie indicator.</li>
              <li>Het aggregatieniveau dat in de kaart is geselecteerd.</li>
              <li>De actuele score van het geselecteerde gebied, inclusief gekleurde achtergrond, dat overeen komt het geselecteerde gebied op de kaart.</li>
              <li>Een lizard-icoon, met een directe koppeling naar Lizard.</li>
              </ul>
              <p>In de grafiek is de trendlijn van de prestatie indicator weergegeven, voor de ingestelde tijdsperiode. De PI-scores zijn per gebied en per maand bepaald, op basis van het aantal relevante gebeurtenissen en de gehanteerde referentiewaarde. De PI-score varieert tussen de waarde 10 en 1. De referentiewaarde is de waarde die wordt gehanteerd waarop de gebruiker gesignaleerd wilt worden om actie te ondernemen. Dit heeft als resultaat een PI-score van 5,5.</p>
              <p>Het aantal gebeurtenissen en de gehanteerde referentiewaarde zijn zichtbaar door de optie "toon waardes" aan te vinken. Er is één referentiewaarde instelbaar per aggregatieniveau (gemeente, wijk, buurt).</p>
              <p>Indien de PI-scores zijn genormaliseerd op basis van gebiedskenmerken - om een vergelijkbare PI-score te krijgen zodat het éne gebied in verhouding staat tot het andere gebied - worden zowel de genormaliseerde gebeurtenissen als de genormaliseerde referentiewaarde getoond. Nadere informatie hierover krijgt u door op het tandwieltje te klikken. De referentiewaarde kan alleen worden ingesteld door de beheerder van de applicatie.</p>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => this.setState({
                showInfoModal: false,
              })}>
                  Sluiten
              </Button>
            </Modal.Footer>
          </Modal>

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
