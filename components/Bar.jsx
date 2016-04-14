import styles from './Bar.css';
import React, { Component, PropTypes } from 'react';
import { VelocityComponent } from 'velocity-react';

class Bar extends Component {

  defaultProps = {
    width: 0,
    height: 0,
    offset: 0,
  }

  constructor(props) {
    super(props);
  }

  render() {

    const textAnim = {
      opacity: 1,
      y: this.props.availableHeight - (this.props.height) - 4,
    };

    const anim = {
      opacity: 1,
      height: this.props.height,
      y: this.props.availableHeight - this.props.height,
    };

    return (
      <svg>
        <VelocityComponent
          animation={textAnim}
          duration={500}
          runOnMount={false}>
          <text opacity={0}
                className={styles.AxisLabel}
                x={this.props.offset - 4}
                y={0}
                fill="white">
                {`${this.props.point}%`}
          </text>
        </VelocityComponent>
        <VelocityComponent
          animation={anim}
          duration={500}
          runOnMount={false}>
          <rect fill={this.props.color}
            opacity={0}
            width={this.props.width}
            height={0}
            x={this.props.offset}
            y={-20}>
          </rect>
        </VelocityComponent>
        <rect fill={'#ffffff'}
              width={20}
              height={2}
              x={this.props.offset - 7}
              y={this.props.availableHeight - 2}>
        </rect>
      </svg>
    );
  }
}

Bar.propTypes = {
  availableHeight: PropTypes.number,
  color: PropTypes.string,
  height: PropTypes.number,
  offset: PropTypes.number,
  point: PropTypes.number,
  width: PropTypes.number,
};

export default Bar;
