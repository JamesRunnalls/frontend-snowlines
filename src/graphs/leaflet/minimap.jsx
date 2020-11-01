import React, { Component } from "react";
import L from "leaflet";
import "./leaflet_colorpicker";
import "./css/leaflet.css";

class MiniMap extends Component {
  state = {
    id: Math.round(Math.random() * 100000),
  };
  componentDidMount() {
    var center = [46.501, 7.992];
    if ("center" in this.props) {
      center = this.props.center;
    }
    var zoom = 10;
    if ("zoom" in this.props) {
      zoom = this.props.zoom;
    }

    this.layer = L.tileLayer(
      "https://wmts20.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-grau/default/current/3857/{z}/{x}/{y}.jpeg"
    );

    if ("basemap" in this.props) {
      var { basemap, basemaps } = this.props;
      this.layer = L.tileLayer(basemaps[basemap].url, {
        attribution: basemaps[basemap].attribution,
      });
    }

    var zoomControl = false;

    this.map = L.map("minimap_" + this.state.id, {
      preferCanvas: true,
      scrollWheelZoom: false,
      dragging: false,
      zoomControl,
      center: center,
      zoom: zoom,
      minZoom: 7,
      maxZoom: 15,
    });
    this.layer.addTo(this.map);
  }

  componentDidUpdate() {
    var { center, zoom } = this.props;
    this.map.setView(center, zoom);
  }

  render() {
    var { id } = this.state;
    var { basemap, onChangeBasemap } = this.props;
    return (
      <React.Fragment>
        <div
          id={"minimap_" + id}
          onClick={() => {
            onChangeBasemap(basemap);
          }}
        ></div>
      </React.Fragment>
    );
  }
}

export default MiniMap;
