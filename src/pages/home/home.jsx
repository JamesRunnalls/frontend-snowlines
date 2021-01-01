import React, { Component } from "react";
import axios from "axios";
import Header from "../../components/header/header";
import About from "../../components/about/about";
import Menu from "../../components/menu/menu";
import SelectBasemap from "../../components/selectbasemap/selectbasemap";
import TimeSelector from "../../components/timeselector/timeselector";
import Basemap from "../../graphs/leaflet/basemap";
import { basemaps } from "../../config.json";
import "../../App.css";

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
    maxdate: new Date(),
    mindate: new Date(Date.now() - 12096e5),
    datearray: [],
    datefiles: [],
    geotiff: [""],
    menu: true,
    about: false,
  };

  toggleAbout = () => {
    this.setState({ about: !this.state.about });
  };

  toggleMenu = () => {
    this.setState({ menu: !this.state.menu });
  };

  onChangeDatetime = (new_datetime) => {
    document.getElementById("time-loading").style.display = "block";
    var { datetime } = this.state;
    this.updateSnowline(datetime, new_datetime).then(() => {
      document.getElementById("time-loading").style.display = "none";
    });
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

  clearGeotiff = () => {
    this.setState({ geotiff: [] });
  };

  async componentDidMount() {
    var { geojson, geojsonid, datetime } = this.state;
    document.getElementById("time-loading").style.display = "block";
    var snowlines = await this.getSnowlineFiles();
    var snowline = await this.getSnowline(snowlines, datetime);
    var datearray = snowlines.data.map((s) => {
      var ds = 24 * 3600;
      return Math.floor(s.datetime / ds) * ds * 1000;
    });
    datetime = new Date(Math.max(...datearray));
    geojson = [snowline];
    geojsonid++;
    this.setState(
      { geojson, geojsonid, snowlines, datearray, datetime },
      () => {
        document.getElementById("time-loading").style.display = "none";
      }
    );
  }

  render() {
    document.title = "Snowlines";
    var {
      datetime,
      mindate,
      maxdate,
      datearray,
      basemap,
      basemaps,
      zoom,
      center,
      geojson,
      geojsonid,
      geotiff,
      menu,
      about,
    } = this.state;
    return (
      <div className="home">
        <div className={menu ? "menu open" : "menu closed"}>
          <div className="boundary" />
          <Menu
            datetime={datetime}
            open={menu}
            toggleAbout={this.toggleAbout}
            toggleMenu={this.toggleMenu}
          />
        </div>
        <div className={menu ? "main open" : "main closed"}>
          <div className="basemap">
            <Basemap
              basemap={basemap}
              zoom={zoom}
              center={center}
              onChangeLocation={this.onChangeLocation}
              geojson={geojson}
              geojsonid={geojsonid}
              geotiff={geotiff}
            />
            <About open={about} close={this.toggleAbout} />
          </div>
          <div className="timeselector">
            <div className="boundary" />
            <TimeSelector
              datetime={datetime}
              datearray={datearray}
              mindate={mindate}
              maxdate={maxdate}
              daysize={30}
              onChangeDatetime={this.onChangeDatetime}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
