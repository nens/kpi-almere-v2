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
    this.state = {
    	width: window.innerWidth,
    	height: window.innerHeight,
    }    
    this.redraw = this.redraw.bind(this);
    this._handleClick = this._handleClick.bind(this);
  }

  redraw() {
  	this.setState({
  		width: window.innerWidth,
  		height: window.innerHeight,
  	});
  }

  _handleClick(e) {
  	console.log('clicked', e.target);
  }

  componentDidMount() {
  	window.addEventListener('resize', this.redraw);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.redraw);
  }

  quantize = d3.scale.quantize()
  	.domain([0, 0.15])
	.range(d3.range(9).map(function(i) {
		return `q${i}-9`;
	}))

  render() {
  	var projection = d3.geo.albers();
  	var pathGenerator = d3.geo.path().projection(projection);
	// projection.scale(1200).translate([this.state.width/3, 300]);  	

  	var paths = this.props.data.features.map((buurt, i) => {

  		var colorClass = `${this.quantize(Math.random(0.15))}`;
  		return <path 
  					onClick={this._handleClick}
  					d={pathGenerator(buurt)} 
  					className={styles[colorClass]}
  					key={i} />;
  	});

    return (
    	<div ref='map' className={styles.Map}>
    		<svg className="choropleth Blues" width={this.state.width} height={this.state.height}>
    			<g className={styles.outline}>
	    			{paths}
    			</g>
    		</svg>
    	</div>
    )
  }
}


Map.propTypes = {}

export default Map;



// http://bl.ocks.org/pleasetrythisathome/raw/9713092/