import styles from './PiMap.css';
import React, { Component, PropTypes } from 'react';
import centroid from 'turf-centroid';
import zoomlevelLookup from './zoomlevelLookup.jsx';
import d3 from 'd3';
import L from 'leaflet';
import _ from 'lodash';
import $ from 'jquery';
import GeoJsonUpdatable from '../lib/GeoJsonUpdatable.jsx';
import { Map, TileLayer, Marker } from 'react-leaflet';
import getColor from '../lib/getColor.jsx';

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
    this.handleMapClick = this.handleMapClick.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.redraw);
  }

  componentWillMount() {}

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

  handleMapClick(feature) {
    this.props.selectRegion(feature);
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
      hovering: false,
    });
  }

  onEachFeature(feature, layer) {

    const featureId = feature.id;
    const featureName = feature.properties.name;

    layer.on('click', () => {
      this.props.selectRegion(feature);
    });

    let selectedIndicator;
    let lastValue;
    let lastScore;
    try {
      const selection1 = _.filter(this.props.indicators.indicators, { regions: [{ selected: true }] });
      const selection2 = _.filter(selection1[0].regions, { regionId: feature.id });
      selectedIndicator = selection2[0];
      lastValue = selectedIndicator.series[selectedIndicator.series.length - 1].value;
      lastScore = selectedIndicator.series[selectedIndicator.series.length - 1].score;
    }
    catch (e) {
      // console.log('error', e);
    }

    layer.setStyle({
      color: (this.props.indicators.region && this.props.indicators.region.id === feature.id) ? '#19A4B9' : '#fff',
      opacity: 1,
      weight: (this.props.indicators.region && this.props.indicators.region.id === feature.id) ? 5 : 1,
      dashArray: (this.props.indicators.region && this.props.indicators.region.id === feature.id) ? '5, 10' : 1,
      fillColor: getColor(lastScore),
      fillOpacity: 1,
    });
    console.log('%c %s %s', `background: ${getColor(lastScore)}; color: #ffffff`, feature.properties.name, lastScore);
  }

  render() {

    let selectedIndicatorItem;

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

    // A better way may be to use the bounding box instead of the centroid.
    let initialLocation = {
      lat: (this.props.indicators.centroid) ? this.props.indicators.centroid.geometry.coordinates[1] : 52.3741,
      lng: (this.props.indicators.centroid) ? this.props.indicators.centroid.geometry.coordinates[0] : 5.2032,
      zoom: zoom,
    };

    const position = [initialLocation.lat, initialLocation.lng];

    const filteredFeatures = (this.props.indicators.regions.results) ?
      this.props.indicators.regions.results.features.filter((feature) => {
        if (feature.properties.name !== '') {
          return feature;
        }
        return false;
      }) : [];

    const markers = (filteredFeatures) ?
      filteredFeatures.map((feature, i) => {
        const center = centroid(feature.geometry);
        let lastScore;
        try {
          const selection1 = _.filter(this.props.indicators.indicators, { regions: [{ selected: true }] });
          const selection2 = _.filter(selection1[0].regions, { regionId: feature.id });
          const selectedIndicator = selection2[0];
          lastScore = Math.round(selectedIndicator.series[selectedIndicator.series.length - 1].score);
        }
        catch (e) {
          // console.log('error', e);
        }

        return <Marker
          key={i}
          onClick={() => self.handleMapClick(feature)}
          icon={new L.DivIcon({
            className: styles.mapLabel,
            html: `${(lastScore) ? lastScore : ''}`,
          })}
          position={[center.geometry.coordinates[1], center.geometry.coordinates[0]]} />;
      }) : [];

      // <i class="fa fa-circle"></i>&nbsp;
      //  - ${feature.properties.name.substr(0, 10)}...

    return (
      <Map
           ref='map'
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
                    height: 500,
                  }}>
        <TileLayer
          attribution=''
          url='https://{s}.tiles.mapbox.com/v3/nelenschuurmans.l15e647c/{z}/{x}/{y}.png'
        />
        <GeoJsonUpdatable
          data={filteredFeatures}
          onEachFeature={this.onEachFeature.bind(this)}
        />
        {markers}
      </Map>
    );
  }
}

Pimap.propTypes = {
  data: PropTypes.any,
  indicators: PropTypes.any,
  selectedRegion: PropTypes.any,
  selectRegion: PropTypes.func,
};

export default Pimap;
