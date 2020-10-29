import React, { Component } from "react";
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

  componentDidMount() {
    var center = [46.501,7.992];
    if ("center" in this.props) {
      center = this.props.center;
    }
    var zoom = 10;
    if ("zoom" in this.props) {
      zoom = this.props.zoom;
    }

    var snowlinesmap = L.tileLayer(
      "https://api.mapbox.com/styles/v1/jamesrunnalls/ckgv0jzjb3mo219n8bgwzu88j/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamFtZXNydW5uYWxscyIsImEiOiJjazk0ZG9zd2kwM3M5M2hvYmk3YW0wdW9yIn0.uIJUZoDgaC2LfdGtgMz0cQ",
      {
        attribution:
          '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | &copy; <a href="https://www.mapbox.com/">mapbox</a>',
      }
    );
    var swisstopo = L.tileLayer(
      "https://wmts20.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-grau/default/current/3857/{z}/{x}/{y}.jpeg",
      {
        attribution:
          '<a title="Swiss Federal Office of Topography" href="https://www.swisstopo.admin.ch/">swisstopo</a>',
      }
    );
    var satellite = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution:
          "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
      }
    );

    var dark = L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      }
    );

    var topolink =
      "https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw?access_token=pk.eyJ1IjoiamFtZXNydW5uYWxscyIsImEiOiJjazk0ZG9zd2kwM3M5M2hvYmk3YW0wdW9yIn0.uIJUZoDgaC2LfdGtgMz0cQ";

    this.baseMaps = {
      snowlinesmap,
      swisstopo,
      satellite,
      dark,
    };

    this.layer = snowlinesmap;
    if ("basemap" in this.props) {
      this.layer = this.baseMaps[this.props.basemap];
    }

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

    this.layer.addTo(this.map);
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
