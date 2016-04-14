import React, { Component, PropTypes } from 'react';
import d3 from 'd3';
import _ from 'underscore';
import Bar from './bar.jsx';

class DataSeries extends Component {

  defaultProps = {
    title: '',
    data: [],
  }

  constructor(props) {
    super(props);
  }

  render() {
    const props = this.props;
    let data;

    if (props.showValues && props.values) {
      data = props.values;
    }
    else {
      data = props.data;
    }

    const yScale = d3.scale.linear()
      .domain([0, d3.max(data)])
      .range([0, this.props.height - 20]);

    const xScale = d3.scale.ordinal()
      .domain(d3.range(data.length))
      .rangeRoundBands([0, this.props.width], 0.8);

    const bars = _.map(data, (point, i) => {
      return (
        <Bar
          point={point}
          height={yScale(point)}
          width={xScale.rangeBand()}
          offset={xScale(i)}
          availableHeight={props.height}
          color={props.color}
          key={i} />
      );
    });
    return (
      <g>{bars}</g>
    );
  }
}

DataSeries.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
};

export default DataSeries;
