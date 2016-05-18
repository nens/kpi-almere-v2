import PerformanceIndicator from './PerformanceIndicator.jsx';
import styles from './PerformanceIndicatorList.css';
import 'velocity-animate';
import 'velocity-animate/velocity.ui';
import { VelocityTransitionGroup } from 'velocity-react';
import velocityHelpers from 'velocity-react/velocity-helpers';
import React, { Component, PropTypes } from 'react';

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
    this.state = {};
    this._selectPi = this._selectPi.bind(this);
  }

  componentDidMount() {
  }

  _selectPi(indicator) {
    this.props.selectPi(indicator);
  }

  render() {

    const enterAnimation = {
      animation: Animations.In,
      stagger: 0,
      duration: 200,
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
    const performanceindicators = chartdata.map((indicator, i) => {
      // console.log('indicator', indicator[0].name);
      const data = indicator[1].regions[0].aggregations.map((aggregation) => {
        return aggregation.score;
      });
      const values = indicator[1].regions[0].aggregations.map((v) => {
        // console.log('v.value', v.value);
        return v.value;
      });

      if (indicator[0].boundary_type_name === this.props.selectedZoomLevel) {
        return <PerformanceIndicator
                  key={i}
                  pid={i}
                  data={data}
                  values={values}
                  selectPi={this._selectPi}
                  indicator={indicator[0]} />;
      }
      else {
        return <div key={i} />;
      }
    });

    return (
      <div style={{ position: 'absolute', height: 800, width: 400, overflowY: 'auto', msOverflowStyle: 'none' }}>
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
