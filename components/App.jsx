/*jshint esnext: true*/

import styles from './App.css';
import queryString from 'query-string';
import React, { Component, PropTypes } from 'react';
import { Button, Grid, Nav, Col, Navbar, NavItem, NavDropdown, MenuItem, Jumbotron } from 'react-bootstrap';
import Auth from './Auth.jsx';
import KPIApp from './KPIApp.jsx';


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
    	'access_token': (localStorage.getItem('access_token')) ? localStorage.getItem('access_token') : undefined,
    	'portal': 'MOFZd4DTHhn0yx4qCJtIe8XdGUGK35StkgPUf8iNJv22AqCviQcwEVIXk3qZcnVh'
    }    
  }

  componentDidMount() {
	let parsedQueryParams = queryString.parse(window.location.search);
	if(parsedQueryParams.access_token) {
		localStorage.setItem('access_token', parsedQueryParams.access_token);
		this.setState({'access_token': parsedQueryParams.access_token});
		var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
		window.history.pushState({path:newurl},'',newurl);
	}    
  }

  render() {	
	let kpiapp = (this.state.access_token) ? <KPIApp portal={this.state.portal} access_token={this.state.access_token} /> : <Grid><Col md={12}><h3>Log in via Open Water ID</h3><p>(klik rechtsboven a.u.b.)</p></Col></Grid>;

    return (
      <div id="main">
		  <Navbar inverse style={{zIndex:999999}}>
		    <Navbar.Header>
		      <Navbar.Brand>
		        <a href="#">KPI Almere</a>
		      </Navbar.Brand>
		      <Navbar.Toggle />
		    </Navbar.Header>
		    <Navbar.Collapse>
		      <Auth 
		      	portal={this.state.portal}
		        access_token={this.state.access_token} />
		    </Navbar.Collapse>
		  </Navbar>	  
		  {kpiapp}
	 </div>
    )
  }
}

App.propTypes = {}

export default App
