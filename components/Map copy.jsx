/*jshint esnext: true*/

import styles from './Map.css';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import fetch from 'isomorphic-fetch';
import topojson from 'topojson';
import d3 from 'd3';
import _ from 'underscore';
import _string from 'underscore.string';


class Map extends Component {
  constructor(props) {
    super(props)
    this.state = {}    
    this.draw = this.draw.bind(this);
  }

  draw(e) {

	var width = window.innerWidth/1.2,
	    height = window.innerHeight/1.2;

	var projection = d3.geo.albers();

	var path = d3.geo.path()
	    .projection(projection);

	if(document.getElementById('map')) document.getElementById('map').remove();

	var svg = d3.select(ReactDOM.findDOMNode(this)).append("svg")
		.attr("id", "map")
	    .attr("width", width)
	    .attr("height", height);  	
	
	var buurten = this.props.data;

    projection
    	.scale(1)
    	.translate([0,0]);

	var b = path.bounds(buurten),
		s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
		t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

	  projection
	      .scale(s)
	      .translate(t);

	  svg.append("path")
	      .datum(buurten)
	      .attr("class", styles.feature)
	      .attr("d", path);

	  svg.append("path")
	      .datum(topojson.mesh(buurten, buurten, function(a, b) { return a !== b; }))
	      .attr("class", styles.mesh)
	      .attr("d", path);

	  svg.append("path")
	      .datum(buurten)
	      .attr("class", styles.outline)
	      .attr("d", path);

  }


  componentDidMount() {
  	window.addEventListener('resize', this.draw);
  	this.draw();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.draw);
  }

  render() {
    return (
    	<div ref='map' className={styles.Map} />
    )
  }
}


Map.propTypes = {}

export default Map;
