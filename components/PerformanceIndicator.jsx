import styles from './PerformanceIndicator.css';
import React, { Component, PropTypes } from 'react';
import CountTo from 'react-count-to';
import DataSeries from './DataSeries.jsx';
import Chart from './chart.jsx';
import { VictoryChart, VictoryLine, VictoryAxis } from 'victory';
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries} from 'react-vis';

class PerformanceIndicator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showValues: false,
    };
    this._handleClick = this._handleClick.bind(this);
    this._handleSelectPi = this._handleSelectPi.bind(this);
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

  render() {
    let chartData = [];
    if (this.state.showValues) {
      chartData = this.props.series.map((cd) => {
        return {x: new Date(cd.date), y: cd.value}
      });
    }
    else {
      chartData = this.props.series.map((cd) => {
        return {x: new Date(cd.date), y: cd.score}
      });
    }

    const minDate = chartData[0].x;
    const ind = (chartData.length-1)/2;
    const midDate = chartData[ind.toFixed()].x;
    const maxDate = chartData[chartData.length-1].x;
    return (
      <div className={styles.PerformanceIndicator}>
        <p className={styles.title}
           onClick={() => this._handleSelectPi(this.props.indicator)}>
           <i className="fa fa-area-chart"></i>&nbsp;&nbsp;{this.props.indicator.region_name}: {this.props.indicator.name}
        </p>
        <div style={{ 'float': 'right' }}>
          <input onClick={this._handleClick}
                 className={styles.showValuesCheckbox}
                 type="checkbox"
                 value="None"
                 id={this.props.pid}
                 name="check" />
          <label className={styles.showValuesLabel} htmlFor={this.props.pid}>Toon waardes</label>
        </div>
        <p className={styles.PerformanceIndicatorDigit}><CountTo to={this.props.indicator.reference_value} speed={500} /></p>
          <VictoryChart
            width={400}
            height={200}
            standalone={true}
            scale={{
              x: 'time'
            }}>
            <VictoryAxis
              tickValues={[
                minDate,
                midDate,
                maxDate,
              ]}
              tickFormat={(x) => x.getFullYear()}/>
            <VictoryLine
              labels={['a','b','c']}
              animate={{duration: 500}}
              interpolation='cardinal'
              style={{
                data: {
                  stroke: '#65B59A',
                }
              }}
              data={chartData}/>
          </VictoryChart>
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
