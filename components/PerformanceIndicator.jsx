import styles from './PerformanceIndicator.css';
import React, { Component, PropTypes } from 'react';
import { Label } from 'react-bootstrap';
import CountTo from 'react-count-to';
import DataSeries from './DataSeries.jsx';
import Chart from './chart.jsx';
import { VictoryChart, VictoryLine, VictoryAxis } from 'victory';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

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
    const chartData = this.props.series.map((cd) => {
      return {
        x: new Date(cd.date),
        y: cd.score,
      };
    });

    const linedata = this.props.series.map((item, i) => {
        return { time: item.date, value: item.value, score: item.score };
    });
    const lastValue = linedata[linedata.length - 1].score;

    const visualisationOrBackside = (this.state.showBackside) ?
      <div>Achterkant!</div>
      :
      <LineChart width={400}
                 height={280}
                 data={linedata}
                 margin={{ top: 15, right: 30, left: 0, bottom: 5 }}>
       <XAxis dataKey="time" />
       <YAxis/>
       <CartesianGrid strokeDasharray="3 3"/>
       <Tooltip/>
       <ReferenceLine y={4} label="Max" stroke="red"/>
       {(this.state.showValues) ? <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{r: 8}} isAnimationActive={true} /> : ''}
       <Line type="monotone" dataKey="score" stroke="#82ca9d" isAnimationActive={false} />
      </LineChart>;

    return (
      <div className={styles.PerformanceIndicator}>
        <div className={styles.divider}
           onClick={() => this._handleSelectPi(this.props.indicator)}>
           <span className="pull-right">
             <Label bsStyle="default">{lastValue}</Label>
           </span>
           <ul className="list-unstyled">
             <li className={styles.title}><i className="fa fa-area-chart"></i>&nbsp;&nbsp;{this.props.indicator.name}</li>
             <li className={styles.title}><i className="fa fa-globe"></i>&nbsp;&nbsp;{this.props.region.properties.name}</li>
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
          <i className="fa fa-cog"
             style={{ cursor: 'pointer' }}
             onClick={this._handleCogClick}>
          </i>
          {visualisationOrBackside}
      </div>
    );
  }
}

//<Chart width={400} height={0}>
    //  <DataSeries
        // showValues={this.state.showValues}
        // data={this.props.data}
        // values={this.props.values}
        // width={400}
        // height={100}
        // color={'#65B59A'}
      // />
 // </Chart>

PerformanceIndicator.propTypes = {
  series: PropTypes.array.isRequired,
  pid: PropTypes.number,
  values: PropTypes.array,
};

export default PerformanceIndicator;









//
//
// <VictoryChart
//   width={400}
//   height={200}
//   standalone={true}
//   padding={{
//     top: 5,
//     bottom: 50,
//     left: 50,
//     right: 40
//   }}
//   scale={{
//     x: 'time'
//   }}>
//   <VictoryAxis
//     tickValues={[
//       minDate,
//       midDate,
//       maxDate,
//     ]}
//     tickFormat={(x) => x.getFullYear()}/>
//   <VictoryLine
//     labels={['a','b','c']}
//     animate={{duration: 500}}
//     interpolation='basis'
//     style={{
//       data: {
//         stroke: '#65B59A',
//       }
//     }}
//     data={chartData}/>
//   <VictoryLine
//     style={{
//       data: {stroke: "red", strokeWidth: 1}
//     }}
//     interpolation={"linear"}
//     data={[
//       {x: new Date(minDate), y: 6},
//       {x: new Date(maxDate), y: 6},
//     ]} />
// </VictoryChart>
