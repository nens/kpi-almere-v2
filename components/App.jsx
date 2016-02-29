/*jshint esnext: true*/

import styles from './App.css';
import queryString from 'query-string';
import React, { Component, PropTypes } from 'react';
import MapGL from 'react-map-gl';
import { connect } from 'react-redux';
import { loginUser } from '../actions';
import { receiveLogin } from '../actions';
import { Button, Grid, Nav, Navbar, NavItem, NavDropdown, MenuItem, Jumbotron } from 'react-bootstrap';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import Auth from './Auth';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      map: {
        width: '100%',
        height: 900,
        latitude: 52.3749,
        longitude: 5.2212,
        zoom: 12,
        mapStyle: 'mapbox://styles/mapbox/streets-v8',
        mapboxApiAccessToken: 'pk.eyJ1IjoibmVsZW5zY2h1dXJtYW5zIiwiYSI6ImhkXzhTdXcifQ.3k2-KAxQdyl5bILh_FioCw'
      }
    }    
  }

  onChangeViewport(opt) {
    this.setState({
      map: Object.assign({}, this.state.map, opt)
    });
  }

  render() {	
    const { access_token, isAuthenticated, errorMessage, dispatch } = this.props

	let parsedQueryParams = queryString.parse(location.search);
	if(parsedQueryParams.access_token) {
		localStorage.setItem('access_token', parsedQueryParams.access_token);
	    var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
	    window.history.pushState({path:newurl},'',newurl);
		window.location.reload();
	}  

	const overlay = this.state.map;

	var map;
	if(this.props.isAuthenticated) {
		map = <MapGL
	        {...overlay}
	        className={styles.map}
	        onChangeViewport={this.onChangeViewport.bind(this)} >
	      </MapGL>;
	} else {
		map = <Grid><Jumbotron>
			    <h2>Almere KPI Dashboard</h2>
			    <p>Om gebruik te kunnen maken van dit KPI dashboard vragen wij u om in te loggen via Open Water ID.</p>
			  </Jumbotron></Grid>;
	}

    return (
      <div>
		  <Navbar inverse>
		    <Navbar.Header>
		      <Navbar.Brand>
		        <a href="#">KPI Almere</a>
		      </Navbar.Brand>
		      <Navbar.Toggle />
		    </Navbar.Header>
		    <Navbar.Collapse>
		      <Auth 
		        access_token={localStorage.getItem('access_token')}
		        isAuthenticated={isAuthenticated}
		        errorMessage={errorMessage}
		      	dispatch={dispatch} />
		    </Navbar.Collapse>
		  </Navbar>	      

		  {map}
	 </div>
    )
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
}

// These props come from the application's
// state when it is started
function mapStateToProps(state) {

  const { auth } = state
  const { isAuthenticated, errorMessage } = auth

  return {
    isAuthenticated,
    errorMessage
  }
}


export default connect(mapStateToProps)(App)
