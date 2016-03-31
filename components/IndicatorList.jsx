/*jshint esnext: true*/

import styles from './IndicatorList.css';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { ButtonGroup, Button, Row, Grid, Col, Nav, Navbar, NavItem, NavDropdown, MenuItem, Jumbotron } from 'react-bootstrap';
import Indicator from './Indicator';



class IndicatorList extends Component {
   constructor(props) {
    super(props)
    this.state = {}    
  }

  componentDidMount() {
    var self = this;
  }

  render() {
    var all_indicators = []
    var data = [{"letter":"A","frequency":".08167"},{"letter":"B","frequency":".01492"},{"letter":"C","frequency":".02782"},{"letter":"D","frequency":".04253"},{"letter":"E","frequency":".12702"},{"letter":"F","frequency":".02288"},{"letter":"G","frequency":".02015"},{"letter":"H","frequency":".06094"},{"letter":"I","frequency":".06966"},{"letter":"J","frequency":".00153"},{"letter":"K","frequency":".00772"},{"letter":"L","frequency":".04025"},{"letter":"M","frequency":".02406"},{"letter":"N","frequency":".06749"},{"letter":"O","frequency":".07507"},{"letter":"P","frequency":".01929"},{"letter":"Q","frequency":".00095"},{"letter":"R","frequency":".05987"},{"letter":"S","frequency":".06327"},{"letter":"T","frequency":".09056"},{"letter":"U","frequency":".02758"},{"letter":"V","frequency":".00978"},{"letter":"W","frequency":".02360"},{"letter":"X","frequency":".00150"},{"letter":"Y","frequency":".01974"},{"letter":"Z","frequency":".00074"}];

    return (
      <div style={{position:'absolute'}}>
        <Grid>
          <Row>
            <Col lg={4} md={4} sm={4} xs={4} className={styles.IndicatorList}>
              <ul>
                <li><Indicator title={'Meldingen burgers'} data={data} /></li>
                <li><Indicator title={'Afhandeltijd meldingen'} data={data} /></li>
                <li><Indicator title={'Schadeclaims - ingediend'} data={data} /></li>
                <li><Indicator title={'Enquete - tevredenheid'} data={data} /></li>
                <li><Indicator title={'Gemalen - energiegebruik'} data={data} /></li>
              </ul>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  } 
}


export default IndicatorList