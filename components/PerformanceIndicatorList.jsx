/*jshint esnext: true*/

import PerformanceIndicator from './PerformanceIndicator.jsx';
import styles from './PerformanceIndicatorList.css';
import queryString from 'query-string';
import createFragment from 'react-addons-create-fragment';
import React, { Component, PropTypes } from 'react';
import _ from 'underscore';


class PerformanceIndicatorList extends Component {
  constructor(props) {
    super(props)
    this.state = {}    
  }

  componentDidMount() {
  }

  render() {	

    var chartdata = this.props.data;

    var performanceindicators = chartdata.map((indicator, i) => {
      return <PerformanceIndicator 
                key={i}
                pid={i}
                data={indicator.data}
                values={indicator.values}
                title={indicator.title} />; 
    });

    return (
      <div style={{position:'absolute', height: 800, width:400, overflowY:'scroll'}}>
      <div className={styles.PerformanceIndicatorList}>
        {performanceindicators}
  	  </div>
      </div>
    )
  }
}

PerformanceIndicatorList.propTypes = {}

export default PerformanceIndicatorList
