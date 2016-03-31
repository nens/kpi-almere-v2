/*jshint esnext: true*/

import styles from './Indicator.css';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { ButtonGroup, Button, Grid, Col, Nav, Navbar, NavItem, NavDropdown, MenuItem, Panel } from 'react-bootstrap';
import fetch from 'isomorphic-fetch';
import d3 from 'd3';
import $ from 'jquery';
import _ from 'underscore';

class Indicator extends Component {

   constructor(props) {
    super(props)
    this.state = {
    	chartWidth: 380
    }    
    this.handleResize = this.handleResize.bind(this);
	this.svg = undefined;
  }

  handleResize(e) {
  	var self = this;

	var s = d3.selectAll('svg');
	s = s.remove();  	
    this.setState({chartWidth: $(self.refs.chart).width()});


  }

  componentDidMount() {
	var node = ReactDOM.findDOMNode(this);
	this.svg = d3.select(node.getElementsByClassName('chart')[0]).append('svg');
    window.addEventListener('resize', this.handleResize);
  }


  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);

  }

  type(d) {
    d.frequency = +d.frequency;
    return d;
  }

  render() {
  	var self = this;

  	var data = self.type(self.props.data);

	var margin = {top: 20, right: 20, bottom: 0, left: 40};
	var width = self.state.chartWidth - margin.left - margin.right;
	var height = 140 - margin.top - margin.bottom;

	var x = d3.scale.ordinal()
	    .rangeRoundBands([0, width], .1);

	var y = d3.scale.linear()
	    .range([height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .ticks(10, "%");

	x.domain(data.map(function(d) { return d.letter; }));
	y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

  	if(self.svg) {

	  	self.svg.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		self.svg.append("g")
		      .attr("class", styles.x)
		      .attr("class", styles.axis)
		      .attr("transform", "translate(0," + height + ")")
		      .call(xAxis);

		self.svg.append("g")
		      .attr("class", styles.y)
		      .attr("class", styles.axis)
		      .call(yAxis)
		    .append("text")
		      .attr("transform", "rotate(-90)")
		      .attr("y", 6)
		      .attr("dy", ".71em")
		      .style("text-anchor", "end")
		      .text("");

		self.svg.selectAll(".bar")
		      .data(data)
		    .enter().append("rect")
		      .attr("class", styles.bar)
		      .attr("x", function(d) { return x(d.letter); })
		      .attr("width", function(d) {
		      	return x.rangeBand()
		      })
		      .attr("y", function(d) { return y(d.frequency); })
		      .attr("height", function(d) { return height - y(d.frequency); });	

  	}

    return (
	    <Panel header={this.props.title}>
	    	<div ref="chart" className="chart" />
	    </Panel>
    )
  } 
}



export default Indicator