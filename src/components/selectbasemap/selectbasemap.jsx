import React, { Component } from "react";
import MiniMap from "../../graphs/leaflet/minimap";
import "../../App.css";

class SelectBasemap extends Component {
  shuffle = (arr) => {
    arr.push(arr.shift());
    return arr;
  };
  render() {
    var { center, zoom, onChangeBasemap, basemaps, basemap } = this.props;
    var trim_basemaps = JSON.parse(JSON.stringify(basemaps));
    delete trim_basemaps[basemap];
    var list = this.shuffle(Object.keys(trim_basemaps));
    return (
      <React.Fragment>
        {list.map((b, index) => (
          <div
            key={b}
            title={trim_basemaps[b].title}
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
