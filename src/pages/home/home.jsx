import React, { Component } from "react";
import axios from "axios";
import About from "../../components/about/about";
import Menu from "../../components/menu/menu";
import SelectBasemap from "../../components/selectbasemap/selectbasemap";
import TimeSelector from "../../components/timeselector/timeselector";
import Basemap from "../../graphs/leaflet/basemap";
import Loading from "../../components/loading/loading";
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
    snowlines: {},
    satellites: [],
    snowline_color: "white",
    maxdate: new Date(),
    mindate: new Date(Date.now() - 12096e5),
    datearray: [],
    datefiles: [],
    menu: window.screen.width < 900 ? false : true,
    about: false,
    updatebasemap: false,
  };

  finishUpdateBasemap = () => {
    this.setState({ updatebasemap: false });
  };

  toggleAbout = () => {
    var { menu, about } = this.state;
    if (!about && window.screen.width < 900) {
      menu = false;
    }
    this.setState({ about: !about, menu });
  };

  toggleMenu = () => {
    this.setState({ menu: !this.state.menu }, () => {
      window.dispatchEvent(new Event("resize"));
    });
  };

  onChangeDatetime = (new_datetime) => {
    document.getElementById("time-loading").style.display = "block";
    var { datetime } = this.state;
    this.updateDate(datetime, new_datetime).then(() => {
      document.getElementById("time-loading").style.display = "none";
    });
  };

  onChangeBasemap = (basemap) => {
    this.setState({ basemap, updatebasemap: true });
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

  formatDate = (date) => {
    let month = "" + (date.getMonth() + 1);
    let day = "" + date.getDate();
    let year = date.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [year, month, day].join("");
  };

  parseDate = (str) => {
    var year = parseInt(str.substring(0, 4));
    var month = parseInt(str.substring(4, 6));
    var day = parseInt(str.substring(6, 8));
    var hour = parseInt(str.substring(9, 11));
    var minute = parseInt(str.substring(11, 13));
    return new Date(year, month, day, hour, minute);
  };

  formatTime = (date) => {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  };

  parseSatellite = (name) => {
    var satellites = ["S3A", "S3B", "S2A", "S2B"];
    var satellite = "";
    for (let i = 0; i < satellites.length; i++) {
      if (name.includes(satellites[i])) {
        satellite = satellites[i];
      }
    }
    return satellite;
  };

  changeObjectProperty = (name, obj, index, key, property) => {
    obj[index][key] = property;
    this.setState({ [name]: obj, updatebasemap: true });
  };

  getSatelliteInfo = (name) => {
    var url = "https://snowlines-geotiff.s3.eu-central-1.amazonaws.com/" + name;
    var arr = name.split("____");
    var datetime = this.parseDate(arr[1].split("_")[0]);
    var time = this.formatTime(datetime);
    var satellite = this.parseSatellite(name);
    var type = name
      .split("_")[0]
      .replace("RGB", "Color")
      .replace("SNOW", "Snow");
    return { name, url, datetime, time, satellite, type, display: false };
  };

  getSatelliteImages = async (datetime) => {
    var date = this.formatDate(datetime);
    var { data } = await axios.get(
      "https://snowlines-database.s3.eu-central-1.amazonaws.com/geotiff/" +
        date +
        ".json"
    );
    data = data.map((d) => this.getSatelliteInfo(d));
    return data;
  };

  updateDate = async (prevDatetime, datetime) => {
    if (prevDatetime !== datetime) {
      var { snowlines, geojson } = this.state;
      var snowline = await this.getSnowline(snowlines, datetime);
      var satellites = await this.getSatelliteImages(datetime);
      geojson = [snowline];
      this.setState({
        geojson,
        snowlines,
        datetime,
        satellites,
        updatebasemap: true,
      });
    }
  };

  async componentDidMount() {
    var { geojson, datetime } = this.state;
    document.getElementById("time-loading").style.display = "block";
    var snowlines = await this.getSnowlineFiles();
    var snowline = await this.getSnowline(snowlines, datetime);
    var datearray = snowlines.data.map((s) => {
      var ds = 24 * 3600;
      return Math.floor(s.datetime / ds) * ds * 1000;
    });
    datetime = new Date(Math.max(...datearray));
    var satellites = await this.getSatelliteImages(datetime);
    geojson = [snowline];
    this.setState(
      {
        geojson,
        snowlines,
        datearray,
        datetime,
        satellites,
        updatebasemap: true,
      },
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
      updatebasemap,
      menu,
      about,
      satellites,
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
            satellites={satellites}
            changeObjectProperty={this.changeObjectProperty}
          />
        </div>
        <div className={menu ? "main open" : "main closed"}>
          <div className="basemap">
            <div className="loading" id="time-loading">
              <Loading />
            </div>
            <Basemap
              basemap={basemap}
              zoom={zoom}
              center={center}
              onChangeLocation={this.onChangeLocation}
              geojson={geojson}
              geotiff={satellites}
              updatebasemap={updatebasemap}
              finishUpdateBasemap={this.finishUpdateBasemap}
            />
            <div className="selectbasemap">
              <SelectBasemap
                basemap={basemap}
                basemaps={basemaps}
                zoom={zoom}
                center={center}
                onChangeBasemap={this.onChangeBasemap}
              />
            </div>
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
