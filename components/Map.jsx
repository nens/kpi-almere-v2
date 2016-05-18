import styles from './Map.css';
import React, { Component, PropTypes } from 'react';
import d3 from 'd3';

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.redraw = this.redraw.bind(this);
    this._handleRegionClick = this._handleRegionClick.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.redraw);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.redraw);
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
      (bboxFeature[1][1] + bboxFeature[0][1]) / 2];

    return {
      scale,
      center,
    };
  }

  _handleRegionClick(region) {
    this.props.selectRegion(region);
  }

  redraw() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  quantize = d3.scale.quantize()
    .domain([0, 0.15])
    .range(d3.range(9).map((i) => {
      return `q${i}-9`;
    }))

  render() {
    if(this.props.data.length < 1) return <div/>;
    const scaleCenter = this.calculateScaleCenter(this.props.data.results);
    const projection = d3.geo.mercator()
      .scale(scaleCenter.scale)
      .center(scaleCenter.center)
      .translate([
        this.state.width / 2,
        this.state.height / 2,
      ]);

    const pathGenerator = d3.geo.path().projection(projection);



    let paths = this.props.data.results.features.map((buurt, i) => {
      const colorClass = `${this.quantize(Math.random(0.15))}`;
      return <path
              onClick={() => this._handleRegionClick(buurt)}
              d={pathGenerator(buurt.geometry)}
              className={styles[colorClass]}
              key={i}>
            </path>;
    });

    let labels = this.props.data.results.features.map((label, i) => {
      const latlng = d3.geo.centroid(label);
      return <div
                key={i}
                fill="white"
                onClick={() => this._handleRegionClick(label)}
                style={{
                  transform: `translate(${projection(latlng)[0]}px, ${projection(latlng)[1]}px)`,
                  position: 'absolute',
                  cursor: 'pointer',
                }}
                className={styles.label}>
                <p><i className="fa fa-circle"></i>&nbsp;&nbsp;{label.properties.name}</p>
              </div>;
    });

    return (
      <div ref='map' className={styles.Map} id='map'>
        {labels}
        <svg width={this.state.width} height={this.state.height}>
          <g className={styles.outline}>
            {paths}
          </g>
        </svg>
      </div>
    );
  }
}

Map.propTypes = {
  data: PropTypes.object,
};

export default Map;
