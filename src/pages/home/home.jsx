import React, { Component } from "react";
import Header from "../../components/header/header";
import SelectBasemap from "../../components/selectbasemap/selectbasemap";
import Basemap from "../../graphs/leaflet/basemap";
import "../../App.css";

class SelectSource extends Component {
  state = {};
  render() {
    return <div></div>;
  }
}

class TimeSelector extends Component {
  state = {};
  render() {
    return <div></div>;
  }
}

class Menu extends Component {
  state = {};
  render() {
    return <div></div>;
  }
}

class Home extends Component {
  state = {
    basemap: "snowlinesmap",
    zoom: 10,
    center: [46.501, 7.992],
    basemaps: {
      snowlinesmap: {
        url:
          "https://api.mapbox.com/styles/v1/jamesrunnalls/ckgv0jzjb3mo219n8bgwzu88j/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamFtZXNydW5uYWxscyIsImEiOiJjazk0ZG9zd2kwM3M5M2hvYmk3YW0wdW9yIn0.uIJUZoDgaC2LfdGtgMz0cQ",
        attribution:
          '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | &copy; <a href="https://www.mapbox.com/">mapbox</a>',
      },
      dark: {
        url:
          "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      },
      satellite: {
        url:
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attribution:
          "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
      },
      swisstopo: {
        url:
          "https://wmts20.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-grau/default/current/3857/{z}/{x}/{y}.jpeg",
        attribution:
          '<a title="Swiss Federal Office of Topography" href="https://www.swisstopo.admin.ch/">swisstopo</a>',
      },
    },
  };

  onChangeBasemap = (basemap) => {
    this.setState({ basemap });
  };

  onChangeLocation = (center, zoom) => {
    this.setState({ center, zoom });
  };

  render() {
    document.title = "Snowlines";
    var { basemap, basemaps, zoom, center } = this.state;
    return (
      <div className="home">
        <div className="header">
          <Header />
        </div>
        <div className="selectbasemap">
          <SelectBasemap
            basemap={basemap}
            basemaps={basemaps}
            zoom={zoom}
            center={center}
            onChangeBasemap={this.onChangeBasemap}
          />
        </div>
        <SelectSource />
        <TimeSelector />
        <Menu />
        <div className="basemap">
          <Basemap
            basemap={basemap}
            basemaps={basemaps}
            zoom={zoom}
            center={center}
            onChangeLocation={this.onChangeLocation}
          />
        </div>
      </div>
    );
  }
}

export default Home;
