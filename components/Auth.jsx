/*jshint esnext: true*/

import React, { Component, PropTypes } from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import Login from './Login'
import Logout from './Logout'
import { loginUser, logoutUser } from '../actions'

class Auth extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { dispatch, access_token, isAuthenticated, errorMessage } = this.props;

    return (
	  <Nav pullRight>
        {!access_token &&
          <Login
            errorMessage={errorMessage}
            onLoginClick={ () => dispatch(loginUser()) }
          />
        }

        {access_token &&
          <Logout onLogoutClick={() => dispatch(logoutUser())} />
        }
	  </Nav>
    )
  }
}

Auth.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string	
}

export default Auth