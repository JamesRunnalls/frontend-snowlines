import React, { Component } from "react";
import { basemaps, topolink } from "../../config.json";
import axios from "axios";
import L from "leaflet";
import "./leaflet_geotiff";
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

  updateGeotiff = async (geotiff, updatebasemap) => {
    if (["satellites"].includes(updatebasemap[0]) || updatebasemap === true) {
      if (updatebasemap[1] === "opacity") {
        for (let i = 0; i < geotiff.length; i++) {
          if (geotiff[i].display && this.geotiff[i] !== "") {
            this.geotiff[i].changeOpacity(geotiff[i].opacity);
          }
        }
      } else {
        for (let i = 0; i < this.geotiff.length; i++) {
          if (this.geotiff[i] !== "") {
            this.geotiff[i].onRemove(this.map);
          }
        }
        this.geotiff = [];
        try {
          for (let i = 0; i < geotiff.length; i++) {
            if (geotiff[i].display) {
              let data = await this.getGeotiff(geotiff[i].url);
              this.geotiff.push(
                L.leafletGeotiff(data, { opacity: geotiff[i].opacity }).addTo(
                  this.map
                )
              );
            } else {
              this.geotiff.push("");
            }
          }
        } catch (e) {
          alert("Failed to plot Geotiff");
        }
      }
    }
  };

  getGeotiff = async (url) => {
    if (Object.keys(this.store).includes(url)) {
      return this.store[url];
    } else {
      document.getElementById("time-loading").style.display = "block";
      var { data } = await axios.get(url, {
        responseType: "arraybuffer",
      });
      document.getElementById("time-loading").style.display = "none";
      this.store[url] = data;
      return data;
    }
  };

  updateGeoJSON = async (geojson) => {
    this.geojson.forEach((g) => {
      this.map.removeLayer(g);
    });
    this.geojson = [];
    try {
      for (let i = 0; i < geojson.length; i++) {
        if (geojson[i].display) {
          let data = await this.getGeoJSON(geojson[i].url);
          this.geojson.push(
            L.geoJSON(data, {
              style: {
                color: geojson[i].color,
                weight: geojson[i].weight,
                fillOpacity: geojson[i].opacity,
              },
            }).addTo(this.map)
          );
        }
      }
    } catch (e) {
      alert("Failed to plot GeoJSON");
    }
  };

  getGeoJSON = async (url) => {
    if (Object.keys(this.store).includes(url)) {
      return this.store[url];
    } else {
      document.getElementById("time-loading").style.display = "block";
      var { data } = await axios.get(url);
      document.getElementById("time-loading").style.display = "none";
      this.store[url] = data;
      return data;
    }
  };

  async componentDidMount() {
    this.store = {};
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
    this.geotiff = [];

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
      minZoom: 5,
      maxZoom: 15,
      maxBoundsViscosity: 0.5,
    });
    var map = this.map;

    if ("bounds" in this.props) {
      var southWest = L.latLng(this.props.bounds[0], this.props.bounds[1]);
      var northEast = L.latLng(this.props.bounds[2], this.props.bounds[3]);
      var bounds = L.latLngBounds(southWest, northEast);
      this.map.setMaxBounds(bounds);
    }

    var colorpicker = L.tileLayer
      .colorPicker(topolink, {
        opacity: 0,
      })
      .addTo(this.map);

    this.basemap.addTo(this.map);
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
    var {
      basemap,
      geojson,
      geotiff,
      updatebasemap,
      finishUpdateBasemap,
    } = this.props;
    if (updatebasemap) {
      this.updateBasemap(prevProps.basemap, basemap);
      this.updateGeoJSON(geojson);
      this.updateGeotiff(geotiff, updatebasemap);
      finishUpdateBasemap();
    }
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
