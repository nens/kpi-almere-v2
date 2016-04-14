import Stats from './Stats.jsx';
import Map from './Map.jsx';
import Authentication from './Authentication';
import PerformanceIndicatorList from './PerformanceIndicatorList.jsx';
import styles from './App2.css';
import { Grid, Row, Col } from 'react-bootstrap';
import React, { Component, PropTypes } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  render() {
    return (
     <Grid fluid>
        <Row>
          <Col md={11}/>
          <Col md={1}>
            <Authentication />
          </Col>
        </Row>
        <Row className={styles.Main}>
          <Col md={8}>
          <Stats title={'Aantal meldingen'} value={3845} />
          <Stats title={'Aantal indicatoren'} value={12} />
          <Map
            data={this.props.data.mapdata}
          />
        </Col>
        <Col md={4}>
          <PerformanceIndicatorList
            data={this.props.data.chartdata}
          />
        </Col>
      </Row>
    </Grid>
  );
  }
}

App.propTypes = {
  data: PropTypes.object,
};

export default App;
