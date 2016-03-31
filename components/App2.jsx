/*jshint esnext: true*/

import Stats from './Stats.jsx';
import Map from './Map.jsx';
import PerformanceIndicatorList from './PerformanceIndicatorList.jsx';
import styles from './App2.css';
import queryString from 'query-string';
import fetch from 'isomorphic-fetch';
import _ from 'underscore';
import topojson from 'topojson';
import { Button, Grid, Row, Nav, Col, Navbar, NavItem, NavDropdown, MenuItem, Jumbotron } from 'react-bootstrap';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';




class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}    
  }

  componentDidMount() {
  }

  render() {	
    return (
       	<Grid fluid={true}>
	      <Row className={styles.Main}>
	      	<Col md={8}>
		      <Stats title={'Aantal meldingen'} value={3845} />
		      <Stats title={'Aantal indicatoren'} value={12} />
		      <Map 
		      	data={this.props.data.mapdata} 
		      />
		    </Col>		    	
		    <Col md={4}>
		    	<PerformanceIndicatorList 
		    		data={this.props.data.chartdata} 
		    	/>
		    </Col>
		  </Row>
		</Grid>
    )
  }
}

App.propTypes = {
	data: PropTypes.object
}

export default App
