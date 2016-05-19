import styles from './PerformanceIndicator.css';
import React, { Component, PropTypes } from 'react';
import CountTo from 'react-count-to';
import DataSeries from './DataSeries.jsx';
import Chart from './chart.jsx';

class PerformanceIndicator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showValues: false,
    };
    this._handleClick = this._handleClick.bind(this);
    this._handleSelectPi = this._handleSelectPi.bind(this);
  }

  componentDidMount() {
  }

  _handleClick() {
    this.setState({
      showValues: !this.state.showValues,
    });
  }

  _handleSelectPi(indicator) {
    this.props.selectPi(indicator);
  }

  render() {
    return (
      <div className={styles.PerformanceIndicator}>
        <p className={styles.title}
           onClick={() => this._handleSelectPi(this.props.indicator)}>
           <i className="fa fa-bar-chart"></i>&nbsp;&nbsp;{this.props.indicator.name}
        </p>
        <div style={{ 'float': 'right' }}>
          <input onClick={this._handleClick}
                 className={styles.showValuesCheckbox}
                 type="checkbox"
                 value="None"
                 id={this.props.pid}
                 name="check" />
          <label className={styles.showValuesLabel} htmlFor={this.props.pid}>Toon waardes</label>
        </div>
        <p className={styles.PerformanceIndicatorDigit}><CountTo to={this.props.indicator.reference_value} speed={500} /></p>
        <Chart width={400} height={100}>
             <DataSeries
                showValues={this.state.showValues}
                data={this.props.data}
                values={this.props.values}
                width={400}
                height={100}
                color={'#65B59A'}
              />
         </Chart>
      </div>
    );
  }
}

PerformanceIndicator.propTypes = {
  data: PropTypes.array.isRequired,
  pid: PropTypes.number,
  values: PropTypes.array,
};

export default PerformanceIndicator;
