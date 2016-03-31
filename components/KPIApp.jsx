/*jshint esnext: true*/

require("!style!css!../node_modules/leaflet/dist/leaflet.css");

import styles from './KPIApp.css';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { ButtonGroup, Button, Grid, Col, Nav, Navbar, NavItem, NavDropdown, MenuItem, Jumbotron } from 'react-bootstrap';
import fetch from 'isomorphic-fetch';
import d3 from 'd3';
import $ from 'jquery';
import _ from 'underscore';
import L from 'leaflet';
import Hash from 'leaflet-hash';
import IndicatorList from './IndicatorList';



var map, choroplethLayer;
var selectedObjectsGroup = L.featureGroup();


class KPIApp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      z: undefined,
      mapdata: undefined
    }    
    this.onEachFeature = this.onEachFeature.bind(this);
    this.highlightFeature = this.highlightFeature.bind(this);
    this.resetHighlight = this.resetHighlight.bind(this);
    this.zoomToFeature = this.zoomToFeature.bind(this);
    this.getColor = this.getColor.bind(this);
    this.createMap = this.createMap.bind(this);
  }

  componentDidMount() {
    var self = this;

    L.Icon.Default.imagePath = '//cdn.leafletjs.com/leaflet-0.7.3/images';
    
    this.map = self.createMap(ReactDOM.findDOMNode(self).getElementsByClassName(styles.map)[0]);
    self.loadGeometry(16);
  }


  onEachFeature(feature, layer) {
    var self = this;
    layer.bindPopup(`<strong>${feature.properties.name}</strong><br/>`);
    layer.on({
      mouseover: self.highlightFeature,
      mouseout: self.resetHighlight,
    });
  }   

  highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
      weight: 2,
      color: '#fff',
      // fillColor: '#ff0000',
      dashArray: '',
      opacity: 1,
      fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera) {
      layer.bringToFront();
    }
  }

  resetHighlight(e) {
    choroplethLayer.resetStyle(e.target);
  }

  zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
  }



  getColor(d) {
    var val = d/10000;
    if(val < 100) {
      return '#528E47';
    } 
    if(val > 100 && val < 200) {
      return '#6EA84B';
    }
    if(val > 200 && val < 300) {
      return '#A5BA3E';
    }
    if(val > 400 && val < 500) {
      return '#F7ED13';
    }

  } 

  loadGeometry(z=16) {

    var self = this;

    console.log('loadGeometry', z);

    selectedObjectsGroup.clearLayers();

    var myHeaders = new Headers();

    myHeaders.append('Authorization', 'Bearer ' + this.props.access_token);

    fetch(`https://nxt.staging.lizard.net/api/v2/regions/?page_size=0&in_bbox=5.120487213134765,52.42901293949973,5.292320251464844,52.316874265314325&z=${z}&format=json`, {
         method: 'GET',
         headers: myHeaders,
         mode: 'cors',
         cache: 'default'
      })
      .then(response => 
        response.text().then(text => ({ text, response }))
      ).then(({ text, response }) => {

        var data = JSON.parse(text);
        
        this.setState({
          'mapdata': data,
          'z': z
        });

        function style(feature) {
          return {
              "fillColor": self.getColor(feature.properties.area),
              "color": "#ffffff",
              "weight": 0,
              "opacity": 0,
              "fillOpacity": 0.7,
          }
        }

        choroplethLayer = L.geoJson(data, {
          style: style,
          onEachFeature: self.onEachFeature      
        }).addTo(selectedObjectsGroup);

        return text;
      }).catch(err => console.log(err));    
  }


  createMap(element) {
    var self = this;

    let bg = L.tileLayer('//{s}.tiles.mapbox.com/v3/nelenschuurmans.iaa98k8k/{z}/{x}/{y}.png', {
      minZoom: 3,
      maxZoom: 20,
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> vrijwilligers',
    });

    let dark = L.tileLayer('//{s}.tiles.mapbox.com/v3/nelenschuurmans.l15h8o1l/{z}/{x}/{y}.png', {
      minZoom: 3,
      maxZoom: 20,
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> vrijwilligers',
    });

    let sat = L.tileLayer('//{s}.tiles.mapbox.com/v3/nelenschuurmans.iaa79205/{z}/{x}/{y}.png', {
      minZoom: 3,
      maxZoom: 20,
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> vrijwilligers',
    });

    let baseMaps = {
      "Topografisch": bg,
      "Contrast": dark,
      "Satelliet": sat,
    };



    let overlayMaps = {};

    map = L.map(element,{
      center: [52.3671,5.1963], // Focus on Amsterdam Centrum
      zoom: 13, 
      layers: [dark],
      minZoom: 1,
      maxZoom: 20,
      zoomControl: false,
    });
    
    selectedObjectsGroup.addTo(map);

    var hash = new L.Hash(map);

    L.control.layers(baseMaps, overlayMaps).addTo(map);
    return map;
  }  


  render() {	
    const {  } = this.props;

    return (
        <div>  
          <IndicatorList />
          <ButtonGroup className={styles.zoombutton}>
            <Button onClick={this.loadGeometry.bind(this, 12)} active={(this.state.z === 12) ? true : false}>Stad</Button>
            <Button onClick={this.loadGeometry.bind(this, 16)} active={(this.state.z === 16) ? true : false}>Wijk</Button>
            <Button onClick={this.loadGeometry.bind(this, 20)} active={(this.state.z === 20) ? true : false}>Buurt</Button>
          </ButtonGroup>                
          <div id="map" style={{height: '100%'}} className={styles.map} />
      	</div>
    );
  }
}

export default KPIApp