import React, { Component } from "react";
import "../../App.css";
import MiniMap from "../../graphs/leaflet/minimap";

class SelectBasemap extends Component {
  state = {};
  render() {
    var { center, zoom, onChangeBasemap, basemaps, basemap } = this.props;
    var trim_basemaps = JSON.parse(JSON.stringify(basemaps));
    delete trim_basemaps[basemap];
    return (
      <React.Fragment>
        {Object.keys(trim_basemaps).map((b, index) => (
          <div
            key={b}
            className={
              index !== Object.keys(trim_basemaps).length - 1
                ? "minimap hide"
                : "minimap"
            }
          >
            <MiniMap
              center={center}
              zoom={zoom}
              basemap={b}
              basemaps={trim_basemaps}
              onChangeBasemap={onChangeBasemap}
            />
          </div>
        ))}
      </React.Fragment>
    );
  }
}

export default SelectBasemap;
