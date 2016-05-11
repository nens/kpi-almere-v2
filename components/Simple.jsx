import React, { Component, PropTypes } from 'react';
import React3 from 'react-three-renderer';
import THREE from 'three';
import topojson from 'topojson';
import centroid from 'turf-centroid';
// import envelope from 'turf-envelope';
import d3 from 'd3';

const materials = {
  phong(color) {
    return new THREE.MeshPhongMaterial({
      color,
      side: THREE.DoubleSide,
    });
  },
  meshLambert(color) {
    return new THREE.MeshLambertMaterial({
      color,
      specular: 0x009900,
      shininess: 30,
      shading: THREE.SmoothShading,
      transparent: true,
    });
  },
  meshWireFrame(color) {
    return new THREE.MeshBasicMaterial({
      color,
      specular: 0x009900,
      shininess: 30,
      shading: THREE.SmoothShading,
      wireframe: true,
      transparent: true,
    });
  },
  meshBasic(color) {
    return new THREE.MeshBasicMaterial({
      color,
      specular: 0x009900,
      shininess: 30,
      shading: THREE.SmoothShading,
      transparent: true,
    });
  },
};

// return scaling factor that fit bounds within width/height
function fit(bounds, width, height) {
  const topLeft = bounds[0];
  const bottomRight = bounds[1];

  const w = bottomRight[0] - topLeft[0];
  const h = bottomRight[1] - topLeft[1];

  const hscale = width / w;
  const vscale = height / h;

  // pick the smallest scaling factor
  const scale = (hscale < vscale) ? hscale : vscale;

  return scale;
}

function addShape(group, shape, extrudeSettings, material, color, x, y, z, rx, ry, rz, s) {
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  const mesh = new THREE.Mesh(geometry, materials[material](color));

  // Add shadows
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.position.set(x, y, z);
  mesh.rotation.set(rx, ry, rz);
  mesh.scale.set(s, s, s);
  group.add(mesh);
}

function addFeature(feature, projection, functions) {
  const group = new THREE.Group();
  scene.add(group);
  var color;
  var amount;
  try {
    color = functions.color(feature.properties);
  } catch(err) {
    console.log(err);
  }
  try {
    amount = functions.height(feature.properties);
  } catch(err) {
    console.log(err);
  }
  var extrudeSettings = {
    amount: amount,
    bevelEnabled: false
  };
  var material = 'phong';
  if (feature.geometry.type === 'Polygon') {
    var shape = createPolygonShape(feature.geometry.coordinates, projection);
    addShape(group, shape, extrudeSettings, material, color, 0, 0, amount, Math.PI, 0, 0, 1);
  } else if (feature.geometry.type === 'MultiPolygon') {
    feature.geometry.coordinates.forEach(function(polygon) {
      var shape = createPolygonShape(polygon, projection);
      addShape(group, shape, extrudeSettings, material, color, 0, 0, amount, Math.PI, 0, 0, 1);
    });
  } else {
    console.log('This tutorial only renders Polygons and MultiPolygons')
  }
  return group;
}

function getProjection(geojson, width, height) {
  // From:
  //   http://stackoverflow.com/questions/14492284/center-a-map-in-d3-given-a-geojson-object?answertab=active#tab-top
  // We are using Turf to compute centroid (turf.centroid) and bounds (turf.envelope) because
  // D3's geo.centroid and path.bounds function expect clockwise polygons, which we cannot always guarantee:
  //   https://github.com/mbostock/d3/wiki/Geo-Paths#_path

  const center = centroid(geojson).geometry.coordinates;
  let projection = d3.geo.mercator()
        .center(center)
        .scale(1)
        .translate([0, 0]);

  // Create the path
  const path = d3.geo.path().projection(projection);

  // Using the path determine the bounds of the current map and use
  // these to determine better values for the scale and translation

  // var env = turf.envelope(geojson);
  const bounds = path.bounds(geojson);

  const scale = fit(bounds, width, height);

  // New projection
  projection = d3.geo.mercator()
    .center(center)
    .scale(scale)
    .translate([0, 0]);

  return projection;
}



class Simple extends Component {
  constructor(props, context) {
    super(props, context);

    // construct the position vector here, because if we use 'new' within render,
    // React will think that things have changed when they have not.
    this.cameraPosition = new THREE.Vector3(0, 0, 5);

    this.state = {
      cubeRotation: new THREE.Euler(),
    };

    this._onAnimate = () => {
      // we will get this callback every frame

      // pretend cubeRotation is immutable.
      // this helps with updates and pure rendering.
      // React will be sure that the rotation has now updated.
      this.setState({
        cubeRotation: new THREE.Euler(
          this.state.cubeRotation.x + 0.1,
          this.state.cubeRotation.y + 0.1,
          0
        ),
      });
    };
  }

  componentDidMount() {
    const json = this.props.municipalities;
    const geojson = topojson.merge(json, json.objects[Object.keys(json.objects)[0]].geometries);
    const projection = getProjection(geojson, 500, 500);

    Object.keys(json.objects).forEach((key) => {
      json.objects[key].geometries.forEach((object) => {
        const feature = topojson.feature(json, object);
        console.log(feature);
        // const group = addFeature(feature, projection, functions);
        // object._group = group;
      });
    });
  }

  render() {
    const width = window.innerWidth; // canvas width
    const height = window.innerHeight; // canvas height

    return (<React3
      mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below
      width={width}
      height={height}
      onAnimate={this._onAnimate}>
      <scene>
        <perspectiveCamera
          name="camera"
          fov={75}
          aspect={width / height}
          near={0.1}
          far={1000}
          position={this.cameraPosition}
        />
        <mesh
          rotation={this.state.cubeRotation}>
          <boxGeometry
            width={1}
            height={1}
            depth={1}
          />
          <meshBasicMaterial color={0x65B59A} />
        </mesh>
      </scene>
    </React3>);
  }
}

Simple.propTypes = {
  municipalities: PropTypes.any,
};

export default Simple;
