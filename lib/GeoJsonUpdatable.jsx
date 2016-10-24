import React from 'react';
import {GeoJson } from 'react-leaflet';
import _ from 'lodash';

export default class GeoJsonUpdatable extends GeoJson {
  componentWillReceiveProps(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.leafletElement.clearLayers();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.leafletElement.addData(this.props.data);
      let selFeat = this.props.selectedFeature;
      let selLayer; 
      _.forEach(this.leafletElement._layers, function (layer) {
        if (selFeat && layer.feature && selFeat.id === layer.feature.id) {
          selLayer = layer
        }
      });

      if (selLayer) {
        selLayer.bringToFront();
      }
    }
  }
}

GeoJsonUpdatable.propTypes = {
  data: React.PropTypes.any,
};
