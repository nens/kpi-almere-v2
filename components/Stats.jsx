import styles from './Stats.css';
import CountTo from 'react-count-to';
import React, { Component, PropTypes } from 'react';

class Stats extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className={styles.Stats}>
        <p className={styles.title}>{this.props.title}</p>
        <p className={styles.Amount}>
          <CountTo to={this.props.value} speed={500} />
        </p>
     </div>
   );
  }
}

Stats.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};

export default Stats;
