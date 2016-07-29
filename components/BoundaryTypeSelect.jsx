import React, { Component, PropTypes } from 'react';
import { Nav, NavItem } from 'react-bootstrap';

class BoundaryTypeSelect extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this._handleClick = this._handleClick.bind(this);
  }

  _handleClick(zoomlevel) {
    this.props.selectZoomLevel(zoomlevel);
  }

  render() {
    if (this.props.indicators === undefined ||
        this.props.indicators.zoomlevels === undefined) {
      return <div/>;
    }

    const ZOOMLEVELS = {
      'DISTRICT': 'Wijk',
      'MUNICIPALITY': 'Gemeente',
    };

    return (
      <Nav
        className='pull-right'
        bsStyle="tabs"
        activeKey={this.props.indicators.zoomlevel}>
        {this.props.indicators.zoomlevels.map((zoomlevel, i) => {
          return <NavItem
            key={i}
            onClick={() => this._handleClick(zoomlevel)}
            active={(this.props.indicators.zoomlevel === zoomlevel) ? true : false}
            eventKey={zoomlevel}>
            {ZOOMLEVELS[zoomlevel] || zoomlevel.charAt(0).toUpperCase() + zoomlevel.slice(1).toLowerCase()}
          </NavItem>;
        })}
      </Nav>
    );
  }
}

BoundaryTypeSelect.propTypes = {
  indicators: PropTypes.any,
  selectZoomLevel: PropTypes.func,
  zoomlevels: PropTypes.array,
};

export default BoundaryTypeSelect;
