/*jshint esnext: true*/

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';


class BarChart extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
      Barchart!!!
	      {this.props.data}
      </div>
    )
  }
}


export default BarChart;