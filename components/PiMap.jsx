import styles from './PiMap.css';
import React, { Component, PropTypes } from 'react';
import d3 from 'd3';
import _ from 'lodash';
import $ from 'jquery';
import Choropleth from 'react-leaflet-choropleth';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

document.onmousemove = function(e){
    let infobox = $('.choro-popover')[0];
    // console.log(infobox);
    if(infobox) {
      $(infobox).css({top: e.pageY+15, left: e.pageX+15, position:'absolute'});;
    }
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
    };
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

  render() {
    const indicatorsSecondArrayValue = this.props.indicators.filter((indicator, i) => {
      if (this.props.indicator &&
        indicator[1].boundary_type_name === this.props.selectedZoomLevel &&
        indicator[0].name === this.props.indicator.name) {
        return indicator[1];
      }
    });
    // console.log('indicatorsSecondArrayValue', indicatorsSecondArrayValue);
    const mapColorConfig = indicatorsSecondArrayValue.map((ind) => {
      return ind[1].regions.map((region) => {
        return {
          'reference_value': ind[0].reference_value,
          'region_name': region.region_name,
          'last_score': region.aggregations[region.aggregations.length - 1].score,
          'last_value': region.aggregations[region.aggregations.length - 1].value,
        };
      });
    });

    // console.log('mapColorConfig', mapColorConfig);

    var self = this;
    const zoomlevelmapping = {
      'DISTRICT': 12,
      'MUNICIPALITY': 10,
    };

    let initialLocation = {
      lat: 52.3741,
      lng: 5.2032,
      zoom: zoomlevelmapping[this.props.selectedZoomLevel],
    };

    let choropleth = <div/>;
    if (this.props.regions.results) {

      // +/- 0.05 correction for almeres weird geometry
      initialLocation.lat = this.calculateScaleCenter(this.props.regions.results).center[1] - 0.07;
      initialLocation.lng = this.calculateScaleCenter(this.props.regions.results).center[0] + 0.11;

      let results = this.props.regions.results.features.filter((feature) => {
        if (feature.properties.name) {
          return feature;
        }
      });

      choropleth = <Choropleth
        data={results}
        valueProperty={(feature) => {
          let returnValue = 0;
          for (const key in mapColorConfig[0]) {
            if (mapColorConfig[0][key].region_name === feature.properties.name) {
              if (mapColorConfig[0][key].last_score < mapColorConfig[0][key].reference_value) {
                returnValue = mapColorConfig[0][key].last_score;
              }
              else {
                returnValue = mapColorConfig[0][key].reference_value;
              }
            }
          }
          return returnValue;
        }}
        visible={(feature) => {
          return true;
        }}
        scale={['red', 'green']}
        steps={10}
        mode='e'
        style={(feature) => {
          try {
            return (feature.id === this.props.selectedRegion.id) ? styleSelected : style;
          } catch(e) {
            return style;
          }
        }}
        onClick={this.onFeatureClick.bind(self)}
        onMouseOver={this.onFeatureHover.bind(self)}
        onMouseOut={this.onFeatureHoverOut.bind(self)}
      />;
    }

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
      <Map center={position}
           zoomControl={false}
           zoom={initialLocation.zoom}
           style={{ position: 'absolute',
                    top: 0,
                    left: 0,
                    width: this.state.width,
                    height: this.state.height,
                  }}>
        <TileLayer
          attribution=''
          url='https://{s}.tiles.mapbox.com/v3/nelenschuurmans.l15e647c/{z}/{x}/{y}.png'
        />
        {choropleth}
        {hover}
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
