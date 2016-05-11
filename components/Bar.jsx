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

    const labelText = (this.props.show) ? <text opacity={0}
          className={styles.AxisLabel}
          x={this.props.offset - 4}
          y={0}
          fontSize={10}
          fill="white">
          {`${this.props.point} ${(this.props.showValues) ? '' : '%'}`}
    </text> : <text/>;

    return (
      <svg>
        <VelocityComponent
          animation={textAnim}
          duration={500}
          runOnMount={false}>
          {labelText}
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
  show: PropTypes.number,
  showValues: PropTypes.bool,
  width: PropTypes.number,
};

export default Bar;
