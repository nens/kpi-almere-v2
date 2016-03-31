/*jshint esnext: true*/

import React, { Component, PropTypes } from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import Login from './Login.jsx'
import Logout from './Logout.jsx'


class Auth extends Component {
  constructor(props) {
    super(props)
  }

  performLogin() {
    console.log('performLogin()');
    let currentOrigin = window.location.href;
    window.location.href = `https://sso.lizard.net/jwt?next=${currentOrigin}&portal=${this.props.portal}`;      
  }

  performLogout() {
    console.log('performLogout');
    localStorage.removeItem('access_token');
    let currentOrigin = window.location.href;
    window.location.href = `https://sso.lizard.net/accounts/logout/?next=${currentOrigin}`;
  }  

  render() {
    const { access_token, portal } = this.props;

    return (
	  <Nav pullRight>
        {!access_token &&
          <Login 
            onLoginClick={ () => this.performLogin() }
          />
        }

        {access_token &&
          <Logout 
            onLogoutClick={ () => this.performLogout() }
          />
        }
	  </Nav>
    )
  }
}

Auth.propTypes = {
  access_token: PropTypes.string
}

export default Auth