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
    this._handleClick = this._handleClick.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.redraw);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.redraw);
  }

  _handleClick(e) {
    console.log('clicked', e.target);
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
    const projection = d3.geo.albers();
    const pathGenerator = d3.geo.path().projection(projection);
    // projection.scale(1200).translate([this.state.width/3, 300]);

    let paths = this.props.data.features.map((buurt, i) => {

      const colorClass = `${this.quantize(Math.random(0.15))}`;
      return <path
            onClick={this._handleClick}
            d={pathGenerator(buurt)}
            className={styles[colorClass]}
            key={i} />;
    });

    return (
      <div ref='map' className={styles.Map}>
        <svg className='choropleth Blues'
             width={this.state.width}
             height={this.state.height}>
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

// http://bl.ocks.org/pleasetrythisathome/raw/9713092/
