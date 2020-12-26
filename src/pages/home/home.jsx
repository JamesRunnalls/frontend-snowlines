import React, { Component } from "react";
import axios from "axios";
import Header from "../../components/header/header";
import About from "../../components/about/about";
import SelectBasemap from "../../components/selectbasemap/selectbasemap";
import Basemap from "../../graphs/leaflet/basemap";
import { basemaps } from "../../config.json";
import "../../App.css";

class SelectSource extends Component {
  state = {};
  render() {
    return <div></div>;
  }
}

class TimeSelector extends Component {
  render() {
    var { datetime, onChangeDatetime } = this.props;
    return (
      <div>
        <input
          type="date"
          value={datetime.toISOString().split("T")[0]}
          onChange={onChangeDatetime}
        />
      </div>
    );
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
    datetime: new Date(),
    basemaps: basemaps,
    geojson: [],
    geojsonid: 0,
    snowlines: {},
    snowline_color: "white",
  };

  onChangeDatetime = (event) => {
    var { datetime } = this.state;
    var new_datetime = new Date(event.target.value);
    this.updateSnowline(datetime, new_datetime);
  };

  onChangeBasemap = (basemap) => {
    let snowline_color = basemaps[basemap].color;
    this.setState({ basemap, snowline_color });
  };

  onChangeLocation = (center, zoom) => {
    this.setState({ center, zoom });
  };

  getSnowlineFiles = async () => {
    var { data } = await axios.get(
      "https://snowlines-database.s3.eu-central-1.amazonaws.com/snowline.json"
    );
    return data;
  };

  getSnowline = async (snowlines, datetime) => {
    var { snowline_color } = this.state;
    let unix = datetime.getTime() / 1000;
    let { bucket, data } = snowlines;
    let index = data.reduce((r, a, i, aa) => {
      return i && Math.abs(aa[r].datetime - unix) < Math.abs(a.datetime - unix)
        ? r
        : i;
    }, -1);
    var snowline_data;
    if (!("data" in data[index])) {
      ({ data: snowline_data } = await axios.get(
        bucket + "/" + data[index].url
      ));
      snowlines.data[index]["data"] = snowline_data;
    } else {
      snowline_data = data[index]["data"];
    }
    var style = {
      color: snowline_color,
      weight: 1,
      opacity: 0.7,
    };
    var details = {
      datetime: new Date(data[index].datetime * 1000),
    };
    return { data: snowline_data, style, details };
  };

  updateSnowline = async (prevDatetime, datetime) => {
    if (prevDatetime !== datetime) {
      var { snowlines, geojson, geojsonid } = this.state;
      var snowline = await this.getSnowline(snowlines, datetime);
      geojson = [snowline];
      geojsonid++;
      this.setState({ geojson, geojsonid, snowlines, datetime });
    }
  };

  async componentDidMount() {
    var { geojson, geojsonid, datetime } = this.state;
    var snowlines = await this.getSnowlineFiles();
    var snowline = await this.getSnowline(snowlines, datetime);
    geojson = [snowline];
    geojsonid++;
    this.setState({ geojson, geojsonid, snowlines });
  }

  render() {
    document.title = "Snowlines";
    var {
      datetime,
      basemap,
      basemaps,
      zoom,
      center,
      geojson,
      geojsonid,
    } = this.state;
    var body = "The snowline for Switzerland is produced using regularly updated satellite images. Snowlines has been produced by Leo Kahle and James Runnalls."
    return (
      <div className="home">
        <div className="header">
          <Header />
        </div>
        <div className="about">
          <About
            title="About Snowlines"
            body={body}
          />
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

        <div className="selectsource">
          <SelectSource />
        </div>
        <div className="timeselector">
          <TimeSelector
            datetime={datetime}
            onChangeDatetime={this.onChangeDatetime}
          />
        </div>
        <Menu />
        <div className="basemap">
          <Basemap
            basemap={basemap}
            zoom={zoom}
            center={center}
            onChangeLocation={this.onChangeLocation}
            geojson={geojson}
            geojsonid={geojsonid}
          />
        </div>
      </div>
    );
  }
}

export default Home;
