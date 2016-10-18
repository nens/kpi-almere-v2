import PerformanceIndicator from './PerformanceIndicator.jsx';
import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import _ from 'lodash';

class PerformanceIndicatorList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      openedAtIndex: [true],
    };
    this.redraw = this.redraw.bind(this);
    this._selectPi = this._selectPi.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.redraw);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.redraw);
  }

  redraw() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  _selectPi(index) {
    const currentRegister = this.state.openedAtIndex;
    if (currentRegister[index] === true) {
      currentRegister[index] = false;
    }
    else {
      currentRegister[index] = true;
    }
    this.setState({
      openedAtIndex: currentRegister,
    });
  }

  render() {
    let _performanceindicators = this.props.indicators.indicators.map((indicator) => {
      return indicator.regions.filter((region) => {
        if (this.props.indicators.region && region.regionId === this.props.indicators.region.id) {
          return {
            'boundaryTypeName': region.boundaryTypeName,
            'name': region.name,
            'daterange': region.daterange || '3M',
            'aggregationPeriod': region.aggregationPeriod,
            'referenceValue': region.referenceValue,
            'regionName': region.regionName,
            'id': region.id,
            'regionId': region.regionId,
            'selected': region.selected,
            'url': region.regionUrl,
            'series': region.series.map((agg) => {
              return {
                'date': agg.date,
                'value': agg.value,
                'score': agg.score,
              };
            }),
          };
        }
        return false;
      });
    });

    _performanceindicators = _.flatten(_performanceindicators);
    _performanceindicators.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    const performanceindicators = _performanceindicators.map((p, i) => {
      return <PerformanceIndicator
              {...this.props}
              indicator={p}
              key={i}
              order={i}
              selectPi={this._selectPi}
              openRegister={this.state.openedAtIndex}
            />;
    });

    return (
      <div style={{
        minHeight: 200,
        overflowY: 'scroll',
      }}>
          {(performanceindicators.length > 0) ? performanceindicators : ''}
      </div>
    );
  }
}

PerformanceIndicatorList.propTypes = {
  indicators: PropTypes.any,
  selectPi: PropTypes.any,
  series: PropTypes.any,
};

export default PerformanceIndicatorList;
