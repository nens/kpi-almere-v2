/*jshint esnext: true*/

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';
import _ from 'underscore';

var BarChart = require('./BarChart.jsx');

// var BarChart = function() {};
// BarChart.prototype.update = function(data) {
//   // custom MyAwesomeScatterPlot update selection logic
//   console.log('----->', data);
// };


var defaults = {
	margin: {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0
	},
	width: 300,
	height: 100,
	xaxis: {
		orientation: 'left'
	},
	yaxis: {
		orientation: 'right'
	}
};

var ChartFactory = function(type, data, node, options) {
  // var newChart;
  
  // throw an error if the chart type doesn't exist
  // if (typeof ChartFactory[type] !== 'function' || typeof ChartFactory[type].prototype.update !== 'function') {
  //   throw new Error(type + ' is not a valid chart type!');
  // }

  // // copy over shared prototype methods to the child chart prototype
  // if (!ChartFactory[type].prototype.initialize) {
  //   _.extend(ChartFactory[type].prototype, ChartFactory.prototype);
  // }
  
  // newChart = new ChartFactory[type]();
  // newChart.initialize(data, node, options);

  return ReactDOM.render(<BarChart/>);

  // return newChart;
};


// // initial d3 setup, like merging options and defaults, and setting chart dimensions,
// // common for all charts. imagine we've defined a `defaults` hash of default options.
// ChartFactory.prototype.initialize = function(data, node, opts) {
//   var options = this.options = _.defaults(opts || {}, defaults);
  
//   // set dimensions, translation offset for axes, etc. nothing related to data!
//   // more or less taken from d3 BarChart Tutorial at http://bost.ocks.org/mike/bar/3/
//   this.height = options.height - (options.margin.top + options.margin.bottom);
//   this.width = options.width - (options.margin.right + options.margin.left);
//   this.xAxis = d3.svg.axis().orient(options.xaxis.orientation);
//   this.yAxis = d3.svg.axis().orient(options.yaxis.orientation);
  
//   // main chart svg width, height, and margins
//   this.svg = d3.select(node).append('svg')
//       .attr('width', this.width + options.margin.left + options.margin.right)
//       .attr('height', this.height + options.margin.top + options.margin.bottom)
//     .append('g')
//       .attr('transform', 'translate(' + options.margin.left + ',' + options.margin.top + ')');

//   // setup axes positions only (scaling involves data and should be chart-specific)
//   this.svg.append('g').attr('class', 'x axis')
//       .attr('transform', 'translate(0, ' + this.height + ')');
//   this.svg.append('g').attr('class', 'y axis')
//       .append('text').attr('transform', 'rotate(-90)');
  
//   // now make first data bind (update) via chart-specific update method
//   this.update(data);
// };


// attach all chart types as static properties
// ChartFactory.BarChart = BarChart;

export default ChartFactory;