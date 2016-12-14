import React, { Component, PropTypes } from 'react';

class ReferenceLabel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { x, y, stroke, payload, referenceVal } = this.props;
    return (
      <svg>
      <defs>
        <filter x="0" y="0" width="1" height="1" id="solid" opacity="0.5">
          <feFlood floodColor="white" floodOpacity="0.6" />
          <feComposite in="SourceGraphic" />
        </filter>
      </defs>
      <text filter={'url(#solid)'} fill={'red'} x={45} y={(y - 5)}>
        Referentiewaarde ({referenceVal})
      </text>
      </svg>
    );
  }
}

ReferenceLabel.propTypes = {};

export default ReferenceLabel;
