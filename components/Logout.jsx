import styles from './Logout.css';
import React, { Component, PropTypes } from 'react'
import { Button } from 'react-bootstrap';

export default class Logout extends Component {

  render() {
    const { onLogoutClick } = this.props

    return (
      <Button onClick={() => onLogoutClick()} className={styles.logoutButton} bsStyle='primary' bsSize='small'>
        Logout
      </Button>
    )
  }

}

Logout.propTypes = {
  onLogoutClick: PropTypes.func.isRequired
}