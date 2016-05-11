import React, { Component, PropTypes } from 'react';
import _string from 'underscore.string';

class Chart extends Component {

  defaultProps = {
    width: 350,
    height: 100,
    type: 'BarChart',
  }

  constructor(props) {
    super(props);
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
          <rect fill={'#65B59A'}
                width={2000}
                height={2}
                x={0}
                y={99}>
          </rect>
        </svg>
      </div>
    );
  }
}

Chart.propTypes = {
  children: PropTypes.object,
  height: PropTypes.number,
  type: PropTypes.number,
  width: PropTypes.number,
};

export default Chart;
