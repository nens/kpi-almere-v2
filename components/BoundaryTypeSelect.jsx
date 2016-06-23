import React, { Component, PropTypes } from 'react';
import { Button, ButtonGroup, ButtonToolbar } from 'react-bootstrap';
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
    if (!this.props.zoomlevels) return <div/>;

    const ZOOMLEVELS = {
      'DISTRICT': 'Wijk',
      'MUNICIPALITY': 'Gemeente',
    };

    const buttons = this.props.zoomlevels.map((zoomlevel, i) => {
      return <Button key={i}
                     active={(this.props.selectedZoomLevel === zoomlevel) ? true : false}
                     onClick={() => this._handleClick(zoomlevel)}>
              {ZOOMLEVELS[zoomlevel] || zoomlevel.charAt(0).toUpperCase() + zoomlevel.slice(1).toLowerCase()}
             </Button>;
    });
    return (
      <ButtonToolbar className={styles.buttonToolbar}>
        <ButtonGroup bsSize="small">
          {buttons}
        </ButtonGroup>
      </ButtonToolbar>
    );
  }
}

BoundaryTypeSelect.propTypes = {
  zoomlevels: PropTypes.array,
};

export default BoundaryTypeSelect;
