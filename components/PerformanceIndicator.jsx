/*jshint esnext: true*/

import styles from './PerformanceIndicator.css';
import queryString from 'query-string';
import React, { Component, PropTypes } from 'react';
import d3 from 'd3';
import _ from 'underscore';
import _string from 'underscore.string';
import CountTo from 'react-count-to';
import {VelocityComponent} from 'velocity-react';


class Bar extends React.Component {

  constructor(props) {
    super(props);
  }

  defaultProps = {
    width: 0,
    height: 0,
    offset: 0
  }  

  render() {

    var textAnim = {
      opacity: 1,
      y: this.props.availableHeight - (this.props.height) - 4,
    };

    var anim = {
      opacity: 1,
      height: this.props.height,
      y: this.props.availableHeight - this.props.height,
    };

    return (
      <svg>
        <VelocityComponent 
          animation={textAnim} 
          duration={500}
          runOnMount={false}>      
          <text opacity={0}
                className={styles.AxisLabel}
                x={this.props.offset-4}
                y={0}
                fill="white">
                {`${this.props.point}%`}
          </text>
        </VelocityComponent>
        <VelocityComponent 
          animation={anim} 
          duration={500}
          runOnMount={false}>
          <rect fill={this.props.color}
            opacity={0}
            width={this.props.width}
            height={0}
            x={this.props.offset}
            y={-20}>
          </rect>
        </VelocityComponent>
        <rect fill={'#ffffff'}
              width={20}
              height={2}
              x={this.props.offset - 7}
              y={this.props.availableHeight-2}>
        </rect>                
      </svg>
    );
  }
}


class DataSeries extends React.Component {

  constructor(props) {
    super(props);
  }

  defaultProps = {
    title: '',
    data: []
  }  

  render() {
    var props = this.props;
    var data;

    if(props.showValues && props.values) {
      data = props.values;
    } else {
      data = props.data;
    }

    var yScale = d3.scale.linear()
      .domain([0, d3.max(data)])
      .range([0, this.props.height - 20]);

    var xScale = d3.scale.ordinal()
      .domain(d3.range(data.length))
      .rangeRoundBands([0, this.props.width], 0.8);

    var bars = _.map(data, function(point, i) {
      return (
        <Bar 
          point={point}
          height={yScale(point)} 
          width={xScale.rangeBand()} 
          offset={xScale(i)} 
          availableHeight={props.height} 
          color={props.color} 
          key={i} />
      )
    });
    return (
      <g>{bars}</g>
    );    
  }
}


class Chart extends React.Component {

  constructor(props) {
    super(props);
  }


  defaultProps = {
    width: 350,
    height: 100,
    type: 'BarChart',
  }    

  componentDidMount() {
    // create chart and do first data bind
  }
  
  componentDidUpdate() {
    // update chart with new data
  }
  
  componentWillUnmount() {
    // cleanup after chart
  }

  render() {
    return (
      <div className={`pi-chart ${_string.dasherize(this.props.type)}`}>
        <svg width={this.props.width} height={this.props.height}>
          {this.props.children}
        </svg>
      </div>
    )
  }
}



class PerformanceIndicator extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showValues: false
    }   
    this._handleClick = this._handleClick.bind(this);
  }

  componentDidMount() {
  }

  _handleClick(e) {
    this.setState({
      showValues: !this.state.showValues
    });
  }

  render() {	
    return (
      <div className={styles.PerformanceIndicator}>
        <p className={styles.title}>{this.props.title}</p>
        <div style={{'float':'right'}}>
          <input onClick={this._handleClick} className={styles.showValuesCheckbox} type="checkbox" value="None" id={this.props.pid} name="check" />
          <label className={styles.showValuesLabel} htmlFor={this.props.pid}>Toon waardes</label>
        </div>        
        <p className={styles.PerformanceIndicatorDigit}><CountTo to={900} speed={500} /></p>

        <Chart width={400} height={100}>
             <DataSeries 
                showValues={this.state.showValues}
                data={this.props.data}
                values={this.props.values}
                width={400} 
                height={100} 
                color={'#65B59A'} 
              />
         </Chart>
  	  </div>
    )
  }
}

PerformanceIndicator.propTypes = {
  title: React.PropTypes.string.isRequired,
  data: React.PropTypes.array.isRequired,
}

export default PerformanceIndicator;




/***
 TODO:
 - Animate bars
 - Add white base to every bar
 - Add label below every bar
 - Add background axes
 - Add mouseovers
***/

// LINKS
// http://bl.ocks.org/pleasetrythisathome/9713092
// http://bl.ocks.org/slashdotdash/8307069
// http://blog.siftscience.com/blog/2015/4/6/d-threeact-how-sift-science-made-d3-react-besties
// https://bost.ocks.org/mike/bar/3/
// https://bl.ocks.org/RandomEtc/cff3610e7dd47bef2d01
// http://www.davesquared.net/2014/09/d3-update-a-bar-chart.html
// https://www.smashingmagazine.com/2015/12/generating-svg-with-react/
// https://github.com/colinmeinke/react-svg-chart
// https://github.com/colinmeinke/react-svg-chart/blob/master/src/BarChart.js
// https://gist.github.com/tdboone/fdd1ea6a6912d635475b