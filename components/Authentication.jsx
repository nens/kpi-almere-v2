import styles from './Authentication.css';
import { Button } from 'react-bootstrap';
import React, { Component } from 'react';

class Authentication extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this._handleClick = this._handleClick.bind(this);
  }

  _handleClick() {
    const currentOrigin = window.location.href;
    const portal = 'MOFZd4DTHhn0yx4qCJtIe8XdGUGK35StkgPUf8iNJv22AqCviQcwEVIXk3qZcnVh';
    window.location.href = `https://sso.lizard.net/jwt?next=${currentOrigin}&portal=${portal}`;
  }

  render() {
    return (
      <div className={styles.Authentication}>
       <Button bsSize="xsmall" onClick={this._handleClick}>{(this.props.username) ? this.props.username : 'Login'}</Button>
      </div>);
  }
}

Authentication.propTypes = {
  // portal: PropTypes.string.isRequired,
};

export default Authentication;
