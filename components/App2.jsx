import Stats from './Stats.jsx';
import Map from './Map.jsx';
import Authentication from './Authentication.jsx';
import PerformanceIndicatorList from './PerformanceIndicatorList.jsx';
import BoundaryTypeSelect from './BoundaryTypeSelect.jsx';
import styles from './App2.css';
import { Grid, Row, Col, Button, ButtonGroup, ButtonToolbar } from 'react-bootstrap';
import React, { Component, PropTypes } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRegion: '',
      selectedPi: '',
      selectedZoomLevel: 'DISTRICT',
    };
    this._selectRegion = this._selectRegion.bind(this);
    this._selectZoomLevel = this._selectZoomLevel.bind(this);
  }

  componentDidMount() {
  }

  _selectRegion(region) {
    this.setState({
      selectedRegion: region,
    });
  }

  _selectZoomLevel(zoomlevel) {
    this.setState({
      selectedZoomLevel: zoomlevel
    });
  }

  render() {
    return (
     <Grid fluid>
        <Row>
          <Col md={11}/>
          <Col md={1}>
            <Authentication username={this.props.username} />
          </Col>
        </Row>
        <Row className={styles.Main}>
          <Col md={8}>
          <Stats title={'Aantal meldingen'} value={12} />
          <Stats title={'Aantal indicatoren'} value={this.props.data.piData.length} />
          <BoundaryTypeSelect
            selectZoomLevel={this._selectZoomLevel}
            selectedZoomLevel={this.state.selectedZoomLevel}
            zoomlevels={this.props.data.zoomlevels} />
          <Map
            selectedZoomLevel={this.state.selectedZoomLevel}
            selectRegion={this._selectRegion}
            data={this.props.data.regions}
          />
        </Col>
        <Col md={4}>
          <PerformanceIndicatorList
            selectedZoomLevel={this.state.selectedZoomLevel}
            data={this.props.data.piData}
          />
        </Col>
      </Row>
    </Grid>
  );
  }
}

App.propTypes = {
  data: PropTypes.object,
  username: PropTypes.string,
};

export default App;
