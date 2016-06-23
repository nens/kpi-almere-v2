import styles from './PerformanceIndicator.css';
import React, { Component, PropTypes } from 'react';
import { Label } from 'react-bootstrap';
import d3 from 'd3';
import CountTo from 'react-count-to';
import DataSeries from './DataSeries.jsx';
import Chart from './chart.jsx';
import VisualisationSettings from './VisualisationSettings.jsx';
import { VictoryChart, VictoryLine, VictoryAxis } from 'victory';

import {
  Area,
  AreaChart,
  Brush,
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  setDaterangeForPI,
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
    let linedata = this.props.series.map((item, i) => {
        return { time: item.date, value: item.value, score: item.score };
    });

    // console.log(JSON.stringify(linedata));

    let interval = -3;
    switch (this.props.indicator.daterange) {
      case '1M':
        interval = -1;
        break;
      case '3M':
        interval = -3;
        break;
      case '1Y':
        interval = -12;
        break;
    }

    const lastDate = new Date(linedata[linedata.length-1].time);
    const timeBack = d3.time.month.offset(lastDate, interval);

    const lastScore = linedata[linedata.length - 1].score;
    const lastValue = linedata[linedata.length - 1].value;

    linedata = linedata.filter((linedataItem) => {
      if (new Date(linedataItem.time) >= timeBack && new Date(linedataItem.time) <= lastDate) {
        return linedataItem;
      }
    });

    const visualisationOrBackside = (this.state.showBackside) ?
      <div>
        <VisualisationSettings {...this.props} />
      </div>
      :
      <ComposedChart width={500}
                 height={280}
                 data={linedata}
                 margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
       <XAxis dataKey="time" />
       <YAxis yAxisId="left" stroke="#82ca9d" />
       <YAxis yAxisId="right" orientation="right" stroke="#8884d8" />
       <CartesianGrid strokeDasharray="3 3"/>
       <Tooltip/>

       <ReferenceLine y={this.props.indicator.reference_value} label="" yAxisId="right" stroke="red"/>
       {(this.state.showValues) ?
       <Area type="monotone" yAxisId="right" dataKey="value" fill="#8884d8" stroke={false} dot={false} activeDot={{r: 8}} isAnimationActive={false} /> :
       <Area type="monotone" yAxisId="left" dataKey="score" fill="#82ca9d" stroke={false} isAnimationActive={false} dot={false} />
      }
      </ComposedChart>;
      // <Brush dataKey='score' height={20} stroke="#82ca9d" travellerWidth={10}/>

    return (
      <div className={styles.PerformanceIndicator}>
        <div className={styles.divider}
           onClick={() => this._handleSelectPi(this.props.indicator)}>
           <span className="pull-right">
             <Label style={{
                 fontSize: '0.95em',
                 backgroundColor: (lastScore > this.props.indicator.reference_value) ? 'red' : 'green'
               }}>{Math.round(lastScore)}</Label>
               <a target="_blank"
                  title="Bekijk in Lizard"
                  href="https://demo.lizard.net/nl/map/topography/point/@52.3731,5.1977,13/-2Days0Hours+0Days2Hours">
                 <img
                   width="20"
                   style={{margin:'0px 0px 5px 5px'}}
                   src="data:image/png;base64,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"/>
               </a>
           </span>

           <ul className="list-unstyled" style={{ borderBottom: '1px solid #3D3F4B' }}>
             <li
               className={styles.title}
               style={{
                 fontWeight: (
                   this.props.selectedIndicator && this.props.selectedIndicator.name === this.props.indicator.name && this.props.selectedIndicator.region_name === this.props.indicator.region_name
                 ) ? 'bold' : ''
               }}>
               <i className="fa fa-area-chart"></i>&nbsp;&nbsp;{this.props.indicator.name}</li>
             <li
               style={{
                 fontWeight: (
                   this.props.selectedIndicator && this.props.selectedIndicator.name === this.props.indicator.name && this.props.selectedIndicator.region_name === this.props.indicator.region_name
                 ) ? 'bold' : ''
               }}
               className={styles.title}>
               <i className="fa fa-globe"></i>&nbsp;&nbsp;{this.props.region.properties.name}</li>
           </ul>
        </div>
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
                fontWeight: (this.props.indicator.daterange === '1Y') ? 'bold' : ''
              }}
              onClick={() => this.props.dispatch(setDaterangeForPI(this.props.indicator, this.props.region, '1Y'))}>1Y
            </li>
            <li
              style={{
                fontWeight: (this.props.indicator.daterange === '3M') ? 'bold' : ''
              }}
              onClick={() => this.props.dispatch(setDaterangeForPI(this.props.indicator, this.props.region, '3M'))}>3M
            </li>
            <li
              style={{
                fontWeight: (this.props.indicator.daterange === '1M') ? 'bold' : ''
              }}
              onClick={() => this.props.dispatch(setDaterangeForPI(this.props.indicator, this.props.region, '1M'))}>1M
            </li>
          </ul>
          {visualisationOrBackside}
      </div>
    );
  }
}



PerformanceIndicator.propTypes = {
  series: PropTypes.array.isRequired,
  pid: PropTypes.number,
  values: PropTypes.array,
};

export default PerformanceIndicator;
