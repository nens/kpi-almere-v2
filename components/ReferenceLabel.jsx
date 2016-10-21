import React, { Component, PropTypes } from 'react';

class ReferenceLabel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { x, y, stroke, payload, referenceVal } = this.props;
    return (
      <text fill={'red'} x={25} y={(y - 5)}>
        Referentiewaarde ({referenceVal})
      </text>
    );
  }
}

ReferenceLabel.propTypes = {};

export default ReferenceLabel;
