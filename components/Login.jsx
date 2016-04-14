import styles from './Login.css';
import React, { Component, PropTypes } from 'react'
import { Button } from 'react-bootstrap';


export default class Login extends Component {

  handleClick(event) {
    this.props.onLoginClick()
  }

  render() {
    const { errorMessage } = this.props;

    return (
      <div>
        <Button onClick={(event) => this.handleClick(event)}
                className={styles.loginButton}
                bsStyle='primary'
                bsSize='small'>
          Login
        </Button>

        {errorMessage &&
          <p>{errorMessage}</p>
        }
      </div>
    )
  }
}

Login.propTypes = {
  onLoginClick: PropTypes.func.isRequired,
  errorMessage: PropTypes.string
}
