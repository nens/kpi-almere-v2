import PerformanceIndicator from './PerformanceIndicator.jsx';
import styles from './PerformanceIndicatorList.css';
import { Well, } from 'react-bootstrap';
import 'velocity-animate';
import 'velocity-animate/velocity.ui';
import { VelocityTransitionGroup } from 'velocity-react';
import velocityHelpers from 'velocity-react/velocity-helpers';
import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

const Animations = {
  // Register these with UI Pack so that we can use stagger later.
  In: velocityHelpers.registerEffect({
    calls: [
      [{
        transformPerspective: [800, 800],
        transformOriginX: ['50%', '50%'],
        transformOriginY: ['100%', '100%'],
        marginBottom: 0,
        opacity: 1,
        rotateX: [0, 130],
      }, 1, {
        easing: 'ease-out',
        display: 'block',
      }],
    ],
  }),

  Out: velocityHelpers.registerEffect({
    calls: [
      [{
        transformPerspective: [800, 800],
        transformOriginX: ['50%', '50%'],
        transformOriginY: ['0%', '0%'],
        marginBottom: -30,
        opacity: 0,
        rotateX: -70,
      }, 1, {
        easing: 'ease-out',
        display: 'block',
      }],
    ],
  }),
};

class PerformanceIndicatorList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.redraw = this.redraw.bind(this);
    this._selectPi = this._selectPi.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.redraw);
  }

  // shouldComponentUpdate(nextProps) {
  //   return !_.isEqual(this.props, nextProps);
  // }

  componentWillUnmount() {
    window.removeEventListener('resize', this.redraw);
  }

  redraw() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  _selectPi(indicator) {
    this.props.selectPi(indicator);
  }

  render() {


    let _performanceindicators = this.props.indicators.indicators.map((indicator) => {
      return indicator.regions.map((region) => {
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
      });
    });

    _performanceindicators = _.flatten(_performanceindicators);
    const performanceindicators = _performanceindicators.map((p, i) => {
      return <PerformanceIndicator
              dispatch={this.props.dispatch}
              indicator={p}
              key={i}
              pid={i}
              region={this.props.region}
              selectedIndicator={this.props.selectedIndicator}
              selectPi={this._selectPi}
              series={p.series}
            />;
    });

    return (
      <div style={{
          height: this.state.height - 100,
          overflowY: 'scroll',
        }}>
          {performanceindicators}
      </div>
    );
  }
}

PerformanceIndicatorList.propTypes = {};

export default PerformanceIndicatorList;
