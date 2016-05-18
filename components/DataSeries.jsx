import React, { Component, PropTypes } from 'react';
import d3 from 'd3';
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

    let bars = [];
    if (data.length > 50) {
      bars = data.map((point, i) => {
        return (
          <Bar
            showValues={this.props.showValues}
            point={point}
            height={yScale(point)}
            width={xScale.rangeBand()}
            offset={xScale(i)}
            availableHeight={props.height}
            color={props.color}
            show={(i % 2)}
            key={i} />
        );
      });
    }
    else {
      bars = data.map((point, i) => {
        return (
          <Bar
            showValues={this.props.showValues}
            point={point}
            height={yScale(point)}
            width={xScale.rangeBand()}
            offset={xScale(i)}
            availableHeight={props.height}
            color={props.color}
            show={1}
            key={i} />
        );
      });
    }

    return (
      <g>{bars}</g>
    );
  }
}

DataSeries.propTypes = {
  height: PropTypes.number,
  showValues: PropTypes.bool,
  width: PropTypes.number,
};

export default DataSeries;
