import React, { Component } from "react";
import { basemaps, topolink } from "../../config.json";
import L from "leaflet";
import "./leaflet_colorpicker";
import "./css/leaflet.css";

class Basemap extends Component {
  zoomIn = () => {
    this.map.setZoom(this.map.getZoom() + 1);
  };

  zoomOut = () => {
    this.map.setZoom(this.map.getZoom() - 1);
  };

  hoverOver = (e) => {
    this.props.hoverFunc(e.target, "over");
  };

  hoverOut = (e) => {
    this.props.hoverFunc(e.target, "out");
  };

  updateBasemap = (prevBasemap, basemap) => {
    if (prevBasemap !== basemap) {
      this.map.removeLayer(this.basemap);
      this.basemap = L.tileLayer(basemaps[basemap].url, {
        attribution: basemaps[basemap].attribution,
      }).addTo(this.map);
    }
  };

  updateGeoJSON = (previd, id, geojson) => {
    if (previd !== id) {
      this.geojson.forEach((g) => {
        this.map.removeLayer(g);
      });
      this.geojson = [];
      geojson.forEach((g) => {
        this.geojson.push(
          L.geoJSON(g.data, {
            style: g.style,
          })
            .bindPopup("<div>" + g.details.datetime + "</div>")
            .addTo(this.map)
        );
      });
    }
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

    this.basemap = L.tileLayer(basemaps.snowlinesmap.url, {
      attribution: basemaps.snowlinesmap.attribution,
    });

    if ("basemap" in this.props) {
      var { basemap } = this.props;
      this.basemap = L.tileLayer(basemaps[basemap].url, {
        attribution: basemaps[basemap].attribution,
      });
    }

    this.geojson = [];

    var zoomControl = false;
    var { setZoomIn, setZoomOut } = this.props;
    if (setZoomIn && setZoomOut) {
      setZoomIn(this.zoomIn);
      setZoomOut(this.zoomOut);
      zoomControl = false;
    }

    this.map = L.map("map", {
      preferCanvas: true,
      zoomControl,
      center: center,
      zoom: zoom,
      minZoom: 7,
      maxZoom: 15,
    });

    var colorpicker = L.tileLayer
      .colorPicker(topolink, {
        opacity: 0,
      })
      .addTo(this.map);

    this.basemap.addTo(this.map);
    var map = this.map;
    var passLocation = this.props.passLocation;
    this.map.on("mousemove", function (e) {
      var lat = Math.round(1000 * e.latlng.lat) / 1000;
      var lng = Math.round(1000 * e.latlng.lng) / 1000;
      var a = colorpicker.getColor(e.latlng);
      var alt = NaN;
      if (a !== null) {
        alt =
          Math.round(
            10 * (-10000 + (a[0] * 256 * 256 + a[1] * 256 + a[2]) * 0.1)
          ) / 10;
      }
      map.attributionControl.setPrefix(
        "(" + lat + "," + lng + ") " + alt + "m"
      );
      if (passLocation) {
        passLocation({ lat, lng, alt });
      }
    });

    if ("onChangeLocation" in this.props) {
      var { onChangeLocation } = this.props;
      this.map.on("zoom", function (e) {
        let zoom = e.target._zoom;
        let latlng = e.target._lastCenter;
        let lat = Math.round(latlng.lat * 1000) / 1000;
        let lng = Math.round(latlng.lng * 1000) / 1000;
        onChangeLocation([lat, lng], zoom);
      });
      this.map.on("drag", function (e) {
        let zoom = e.target._zoom;
        let latlng = map.getCenter();
        let lat = Math.round(latlng.lat * 1000) / 1000;
        let lng = Math.round(latlng.lng * 1000) / 1000;
        onChangeLocation([lat, lng], zoom);
      });
    }
  }

  componentDidUpdate(prevProps) {
    var { basemap, geojson, geojsonid } = this.props;
    this.updateBasemap(prevProps.basemap, basemap);
    this.updateGeoJSON(prevProps.geojsonid, geojsonid, geojson);
  }

  render() {
    return (
      <React.Fragment>
        <div id="map"></div>
      </React.Fragment>
    );
  }
}

export default Basemap;
