import React, { Component, PropTypes } from 'react';
import { Nav, NavItem, Button, ButtonGroup, ButtonToolbar } from 'react-bootstrap';
import styles from './BoundaryTypeSelect.css';

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

    if (!this.props.indicators) return <div/>;
    if (!this.props.indicators.zoomlevels) return <div/>;


    const ZOOMLEVELS = {
      'DISTRICT': 'Wijk',
      'MUNICIPALITY': 'Gemeente',
    };

    return (
      <Nav
        style={{
          marginTop: 10,
        }}
        bsStyle="tabs"
        activeKey={this.props.indicators.selectedZoomLevel}>
        {this.props.indicators.zoomlevels.map((zoomlevel, i) => {
          return <NavItem
            key={i}
            onClick={() => this._handleClick(zoomlevel)}
            active={(this.props.indicators.selectedZoomLevel === zoomlevel) ? true : false}
            eventKey={zoomlevel}>
            {ZOOMLEVELS[zoomlevel] || zoomlevel.charAt(0).toUpperCase() + zoomlevel.slice(1).toLowerCase()}
          </NavItem>;
        })}
      </Nav>
    );
  }
}

BoundaryTypeSelect.propTypes = {
  zoomlevels: PropTypes.array,
};

export default BoundaryTypeSelect;
