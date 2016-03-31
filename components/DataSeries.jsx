/*jshint esnext: true*/

import React, { Component, PropTypes } from 'react';
import d3 from 'd3';
import Bar from './Bar.jsx';

class DataSeries extends React.Component {

  constructor(props) {
    super(props);
  }
  render() {
    let { data, width, height, color } = this.props;
    let yScale = d3.scale.linear().domain([0, d3.max(data)])
      .range([0, height]);
    let xScale = d3.scale.ordinal().domain(d3.range(data.length))
      .rangeRoundBands([0, width], 0.05);
    let bars = this.props.data.map((point, i) => {
      return (
        <Bar
            height={yScale(point)}
            width={xScale.rangeBand()}
            offset={xScale(i)}
            availableHeight={height}
            color={color}
            key={i}
        />
      )
    });
    return (
      <g>{bars}</g>
    );
  }
}
export default DataSeries;