import PerformanceIndicator from './PerformanceIndicator.jsx';
import styles from './PerformanceIndicatorList.css';
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

  shouldComponentUpdate(nextProps) {
    return !_.isEqual(this.props, nextProps);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.redraw);
  }

  redraw() {
    console.log('resize, redraw');
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  _selectPi(indicator) {
    this.props.selectPi(indicator);
  }

  render() {

    const enterAnimation = {
      animation: Animations.In,
      stagger: 0,
      duration: 400,
      backwards: true,
      display: 'block',
      style: {
        display: 'none',
      },
    };

    const leaveAnimation = {
      animation: Animations.Out,
      stagger: 0,
      duration: 200,
      backwards: true,
    };

    const groupStyle = {
      margin: '10px 0',
    };

    const chartdata = this.props.data;

    let _performanceindicators = chartdata.map((indicator) => {
      return indicator[1].regions.map((region) => {
        return {
          'boundary_type_name': indicator[0].boundary_type_name,
          'name': indicator[0].name,
          'aggregation_period': indicator[0].aggregation_period,
          'reference_value': indicator[0].reference_value,
          'region_name': region.region_name,
          'series': region.aggregations.map((agg) => {
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
      if (p.boundary_type_name === this.props.selectedZoomLevel) {
        return <PerformanceIndicator
            series={p.series}
            key={i}
            pid={i}
            selectPi={this._selectPi}
            indicator={p}
          />;
      }
    });

    return (
      <div>
        <div className={styles.PerformanceIndicatorList}>
          <VelocityTransitionGroup component="div"
                                   className="flex-1"
                                   style={groupStyle}
                                   enter={enterAnimation}
                                   leave={leaveAnimation}>
            {performanceindicators}
          </VelocityTransitionGroup>
        </div>
      </div>
    );
  }
}

PerformanceIndicatorList.propTypes = {
  data: PropTypes.array,
};

export default PerformanceIndicatorList;
