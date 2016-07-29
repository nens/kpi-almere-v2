import styles from './PerformanceIndicator.css';
import React, { Component, PropTypes } from 'react';
import {
  Label,
  Panel,
} from 'react-bootstrap';
import * as d3 from 'd3';
import VisualisationSettings from './VisualisationSettings.jsx';
import {
  Area,
  ComposedChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  setDaterange,
} from '../actions.jsx';

class PerformanceIndicator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showValues: false,
      showBackside: false,
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
    let linedata = this.props.indicator.series.map((item) => {
      return { time: item.date, value: item.value, score: item.score };
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
    const timeBack = d3.timeMonth.offset(lastDate, interval);

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
          {...this.props} />
      </div>
      :
      <ResponsiveContainer height={200}>
        <ComposedChart
          data={linedata}
          margin={{ top: 10, right: -30, left: -40, bottom: 0 }}>
          <XAxis dataKey="time" tickFormatter={(tick) => {
            const d = new Date(tick);
            const options = {
              year: '2-digit',
              month: 'short',
            };
            return `${d.toLocaleDateString('nl-NL', options)}`;
          }} />
         <YAxis
           yAxisId="left"
           domain={[1, 10]}
         />
         <YAxis
           yAxisId='right'
           orientation='right'
         />
         <Tooltip />
         <ReferenceLine
           y={this.props.indicator.referenceValue}
           label=''
           yAxisId='right'
           stroke='red'
         />
         {(this.state.showValues) ?
           <Area
             type='monotone'
             yAxisId='right'
             dataKey='value'
             fill='#8884d8'
             dot={false}
             activeDot={{ r: 8 }}
             isAnimationActive={false}
            />
          :
           <Area
             type='monotone'
             yAxisId='left'
             dataKey='score'
             fill='#82ca9d'
             isAnimationActive={false}
             dot={false}
          />
        }
        </ComposedChart>
      </ResponsiveContainer>;

    const header = (
        <div
            onClick={() => this._handleSelectPi(this.props.indicator)}
            style={{
              cursor: 'pointer',
              fontWeight: (this.props.indicator.selected) ? 'bold' : '',
            }}>
          <span className="pull-right">
            <Label style={{
              fontSize: '0.95em',
              backgroundColor: (lastScore > this.props.indicator.referenceValue) ? 'red' : 'green',
            }}>{Math.round(lastScore)}</Label>
              <a target="_blank"
                 title="Bekijk in Lizard"
                 href="https://flevoland.lizard.net/nl/map/topography,overrun/point@52.3351,5.4815,11/Oct,19,2011-Sep,15,2015">
                <img
                  width="20"
                  style={{ margin: '0px 0px 5px 5px' }}
                  src="data:image/png;base64,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"/>
              </a>
          </span>
          {this.props.indicator.name}<br/>

        </div>
      );
    return (
      <Panel
        bsStyle={(this.props.indicator.selected) ? 'primary' : 'default'}
        header={header}>
        <div style={{ 'float': 'right' }}>
          <input onClick={this._handleClick}
                 className={styles.showValuesCheckbox}
                 type="checkbox"
                 value="None"
                 id={this.props.pid}
                 name="check" />
          <label className={styles.showValuesLabel} htmlFor={this.props.pid}>Toon waardes</label>
          &nbsp;&nbsp;
        </div>
          <ul className="list-unstyled list-inline" style={{ cursor: 'pointer' }}>
            <li><i className="fa fa-cog"
                   onClick={this._handleCogClick}></i>
            </li>
            <li
              style={{
                fontWeight: (this.props.indicators.daterange === '5Y') ? 'bold' : '',
              }}
              onClick={() => this.props.dispatch(setDaterange('5Y'))}>5Y
            </li>
            <li
              style={{
                fontWeight: (this.props.indicators.daterange === '3Y') ? 'bold' : '',
              }}
              onClick={() => this.props.dispatch(setDaterange('3Y'))}>3Y
            </li>
            <li
              style={{
                fontWeight: (this.props.indicators.daterange === '1Y') ? 'bold' : '',
              }}
              onClick={() => this.props.dispatch(setDaterange('1Y'))}>1Y
            </li>
          </ul>
          {visualisationOrBackside}
      </Panel>
    );
  }
}

PerformanceIndicator.propTypes = {
  dispatch: PropTypes.func,
  indicator: PropTypes.any,
  indicators: PropTypes.any,
  pid: PropTypes.number,
  selectPi: PropTypes.any,
  values: PropTypes.array,
};

export default PerformanceIndicator;
