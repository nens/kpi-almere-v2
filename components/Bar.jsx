/*jshint esnext: true*/

import React, { Component, PropTypes } from 'react';

class Bar extends React.Component {

  constructor(props) {
    super(props);
  }
  render() {
    return (
      <rect fill={this.props.color}
        width={this.props.width} height={this.props.height}
        x={this.props.offset} y={this.props.availableHeight - this.props.height} />
    )
  }
}
Bar.defaultProps = {
  width: 800,
  height: 200,
  fillColor: '#d70206'
}
export default Bar;