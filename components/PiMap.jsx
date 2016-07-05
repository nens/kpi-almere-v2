import styles from './PiMap.css';
import React, { Component, PropTypes } from 'react';
import zoomlevelLookup from './zoomlevelLookup.jsx';
import d3 from 'd3';
import _ from 'lodash';
import $ from 'jquery';
import Choropleth from 'react-leaflet-choropleth';
import GeoJsonUpdatable from '../lib/GeoJsonUpdatable.jsx';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

document.onmousemove = function(e){
    let infobox = $('.choro-popover')[0];
    // console.log(infobox);
    if(infobox) {
      $(infobox).css({top: e.pageY+15, left: e.pageX+15, position:'absolute'});;
    }
}

function getColor(d) {
  return d > 10 ? '#800026' :
    d > 8 ? '#BD0026' :
    d > 6 ? '#E31A1C' :
    d > 4 ? '#FC4E2A' :
    d > 2 ? '#FD8D3C' :
    d > 1 ? 'rgb(86,221,84)' :
    'grey';
}


const style = {
  fillColor: '#000',
  weight: 2,
  opacity: 1,
  color: 'white',
  dashArray: '5',
  fillOpacity: 0.5,
};

const styleSelected = {
  fillColor: '#fff',
  weight: 8,
  opacity: 1,
  color: 'white',
  dashArray: '0',
  fillOpacity: 0.5,
};

class Pimap extends Component {

  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      hovering: false,
      hoverContent: '',
      zoomlevel: undefined,
    };
    this._setZoomlevel = this._setZoomlevel.bind(this);
    this.redraw = this.redraw.bind(this);
    this.onFeatureClick = this.onFeatureClick.bind(this);
    this.onFeatureHover = this.onFeatureHover.bind(this);
    this.onFeatureHoverOut = this.onFeatureHoverOut.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.redraw);
  }

  // shouldComponentUpdate(nextProps) {
  //   return !_.isEqual(this.props, nextProps);
  // }

  componentWillUnmount() {
    window.removeEventListener('resize', this.redraw);
  }



  redraw() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }


  _setZoomlevel(zoomlevel) {
    if (zoomlevel === this.state.zoomlevel) {
      this.setState({
        zoomlevel: undefined,
      });
    }
    else {
      this.setState({
        zoomlevel,
      });
    }
  }


  calculateScaleCenter(features) {
    // Get the bounding box of the paths (in pixels!) and calculate a
    // scale factor based on the size of the bounding box and the map
    // size.
    const bboxPath = d3.geo.bounds(features);
    const scale = 25 / Math.max(
        (bboxPath[1][0] - bboxPath[0][0]) / this.state.width,
        (bboxPath[1][1] - bboxPath[0][1]) / this.state.height
    );

    // Get the bounding box of the features (in map units!) and use it
    // to calculate the center of the features.
    const bboxFeature = d3.geo.bounds(features);
    const center = [
      (bboxFeature[1][0] + bboxFeature[0][0]) / 2,
      (bboxFeature[1][1] + bboxFeature[0][1]) / 2,
    ];

    return {
      scale,
      center,
    };
  }

  onFeatureClick(feature) {
    this.props.selectRegion(feature.layer.feature);
  }

  onFeatureHover(feature) {
    this.setState({
      hovering: true,
      hoverContent: feature.layer.feature,
    });
  }

  onFeatureHoverOut() {
    this.setState({
      hovering: false
    });
  }

  onEachFeature(feature, layer) {

    let selectedIndicatorItem = undefined;
    const selectedIndicator = this.props.indicators.indicators.filter((indicator) => {
      return indicator.regions.filter((region) => {
        if (region.selected === true) {
          selectedIndicatorItem = region;
          return region;
        }
        else {
          return false;
        }
      });
    });

    const featureId = feature.id;
    const featureName = feature.properties.name;

    // console.log('feature in onEachFeature', feature);
    // console.log('featureId in onEachFeature', featureId);
    // console.log('featureName in onEachFeature', featureName);

    if(selectedIndicatorItem) {

      const indicatorName = selectedIndicatorItem.name;

      const activeIndicator = this.props.indicators.indicators.filter((indicator) => {
        if (indicator.name === indicatorName) {
          return indicator;
        }
      });

      const colorme = activeIndicator[0].regions.filter((region) => {
        if (region.regionId === featureId) {
          return region;
        }
      })[0];

      let myScore = 0;
      if (colorme) {
        myScore = colorme.series[colorme.series.length - 1].score;
      }


      let weight = 1;
      if (selectedIndicatorItem && feature.id === selectedIndicatorItem.regionId) {
        weight = 10;
      }

      layer.on('click', () => {
        this.props.selectRegion(feature);
      });

      layer.setStyle({
        color: '#fff',
        opacity: 1,
        weight,
        fillColor: getColor(myScore),
        fillOpacity: 1,
      });
      console.log('%c %s %s', `background: ${getColor(myScore)}; color: #ffffff`, feature.properties.name, myScore);

    }


  }

  render() {

    let selectedIndicatorItem;
    this.props.indicators.indicators.filter((indicator) => {
      return indicator.regions.filter((region) => {
        if (region.selected === true) {
          selectedIndicatorItem = region;
          return region;
        }
        else {
          return false;
        }
      });
    });

    let zoom = 11;
    if (selectedIndicatorItem && selectedIndicatorItem.boundaryTypeName === 'DISTRICT') {
      zoom = 11;
    } else if (selectedIndicatorItem && selectedIndicatorItem.boundaryTypeName === 'MUNICIPALITY') {
      zoom = 9;
    }

    var self = this;
    const zoomlevelmapping = {
      'DISTRICT': 12,
      'MUNICIPALITY': 10,
    };

    let initialLocation = {
      lat: 52.3741,
      lng: 5.2032,
      zoom: zoom,
    };

    const position = [initialLocation.lat, initialLocation.lng];

    const hover = (this.state.hovering) ?
    <div
      className="choro-popover"
      style={{
        backgroundColor: '#353535',
        padding: 20,
        color: '#fff',
        opacity: 0.9,
        position: 'absolute',
        zIndex: 999999,
      }}>{(this.state.hoverContent) ? this.state.hoverContent.properties.name : 'Geen informatie beschikbaar'}</div> :
    <div/>;


    return (
      <Map
           center={position}
           zoomControl
           zoom={(this.state.zoomlevel) ? this.state.zoomlevel : initialLocation.zoom}
           scrollWheelZoom={false}
           keyboard={false}
           boxZoom={false}
           style={{ position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: this.state.height - 100,
                  }}>
        <TileLayer
          attribution=''
          url='https://{s}.tiles.mapbox.com/v3/nelenschuurmans.l15e647c/{z}/{x}/{y}.png'
        />
        <GeoJsonUpdatable
          data={this.props.indicators.regions.results}
          onEachFeature={this.onEachFeature.bind(this)}
        />
      </Map>
    );
  }
}

Pimap.propTypes = {
  data: PropTypes.any,
  selectRegion: PropTypes.func,
  selectedRegion: PropTypes.any,
};

export default Pimap;
