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
    snowlines_files: [],
    snowlines: [],
    satellites: [],
    maxdate: new Date(),
    mindate: new Date(Date.now() - 12096e5),
    datearray: [],
    datefiles: [],
    menu: window.screen.width < 900 ? false : true,
    about: false,
    updatebasemap: false,
    modal: true,
  };

  compare = (a, b) => {
    if (a.type < b.type) {
      return 1;
    }
    if (a.type > b.type) {
      return -1;
    }
    return 0;
  };

  roundDate = (datetime) => {
    return Math.floor(datetime / (3600 * 24)) * (3600 * 24);
  };

  formatDate = (date) => {
    let month = "" + (date.getMonth() + 1);
    let day = "" + date.getDate();
    let year = date.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [year, month, day].join("");
  };

  formatTime = (date) => {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + ampm;
    return strTime;
  };

  parseDate = (str) => {
    var year = parseInt(str.substring(0, 4));
    var month = parseInt(str.substring(4, 6));
    var day = parseInt(str.substring(6, 8));
    var hour = parseInt(str.substring(9, 11));
    var minute = parseInt(str.substring(11, 13));
    return new Date(year, month, day, hour, minute);
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

  changeObjectProperty = (name, obj, index, key, property, updatebasemap) => {
    obj[index][key] = property;
    if (updatebasemap) {
      this.setState({ [name]: obj, updatebasemap: [name, key] });
    } else {
      this.setState({ [name]: obj });
    }
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
    data = data.data.map((d) => {
      d.url = data.bucket + "/" + d.url;
      d.date = this.roundDate(d.datetime);
      return d;
    });
    return data;
  };

  getSnowlines = async (snowlines_files, datetime) => {
    let unix = datetime.getTime() / 1000;
    let date = this.roundDate(unix);
    let data = snowlines_files.filter((s) => s.date === date);
    data = data.map((d, index) => {
      d.color = "white";
      d.weight = 1;
      d.opacity = 0.2;
      d.dt = new Date(d.datetime * 1000);
      d.display = index === 0 ? true : false;
      d.time = this.formatTime(new Date(d.datetime * 1000));
      d.settings = false;
      return d;
    });
    return data;
  };

  getSatelliteInfo = (name) => {
    var url = "https://snowlines-geotiff.s3.eu-central-1.amazonaws.com/" + name;
    var arr = name.split("____");
    var datetime = this.parseDate(arr[1].split("_")[0]);
    var time = this.formatTime(datetime);
    var satellite = this.parseSatellite(name);
    var type = name
      .split("_")[0]
      .replace("RGB", "Color image")
      .replace("SNOW", "Snow pixels");
    var opacity = 1;
    return {
      name,
      url,
      datetime,
      time,
      satellite,
      type,
      opacity,
      display: false,
      settings: false,
    };
  };

  getSatelliteImages = async (datetime) => {
    var date = this.formatDate(datetime);
    var { data } = await axios.get(
      "https://snowlines-database.s3.eu-central-1.amazonaws.com/geotiff/" +
        date +
        ".json"
    );
    data = data.map((d) => this.getSatelliteInfo(d));
    data.sort(this.compare);
    return data;
  };

  updateDate = async (prevDatetime, datetime) => {
    if (prevDatetime !== datetime) {
      var { snowlines_files } = this.state;
      var snowlines = await this.getSnowlines(snowlines_files, datetime);
      var satellites = await this.getSatelliteImages(datetime);
      this.setState({
        snowlines,
        datetime,
        satellites,
        updatebasemap: true,
      });
    }
  };

  async componentDidMount() {
    var { datetime } = this.state;
    document.getElementById("time-loading").style.display = "block";
    var snowlines_files = await this.getSnowlineFiles();
    var datearray = snowlines_files.map(
      (s) => this.roundDate(s.datetime) * 1000
    );
    datetime = new Date(Math.max(...datearray));
    var satellites = await this.getSatelliteImages(datetime);
    var snowlines = await this.getSnowlines(snowlines_files, datetime);
    this.setState(
      {
        snowlines,
        snowlines_files,
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

  closeModal = () => {
    this.setState({ modal: false });
  };

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
      updatebasemap,
      menu,
      about,
      snowlines,
      satellites,
      modal,
    } = this.state;
    return (
      <div className="home">
        {modal && (
          <div className="modal">
            <div className="close" onClick={this.closeModal} title="Close">
              &#215;
            </div>
            <h2>Thanks for visiting Snowlines.ch</h2>
            <p>
              As keen ski tourers, we started this project to use satellite data
              to map snow cover across Switzerland, to avoid showing up to ski
              and being faced with bare, grassy slopes.
            </p>
            <p>
              However we recently discovered that the guys at{" "}
              <a href="https://exolabs-ch.gitbook.io/cosmos/">Exolabs</a> have
              done an excellent job of making our work obsolete and we highly
              recommend you check out their{" "}
              <a href="https://play.google.com/store/apps/details?id=com.exosnow">
                app
              </a>{" "}
              in order to get access to daily snow cover predictions at a crazy
              resolution.
            </p>
            <p>
              If you're interested in the open source code behind this project
              please check out the learn more section at the bottom of the menu.
            </p>
            <p>Happy skiing</p>
            <p>
              <a href="https://github.com/lekah" title="Check out Leo's GitHub">Leo</a> &{" "}
              <a href="https://github.com/JamesRunnalls" title="Check out James' GitHub">James</a>
            </p>
          </div>
        )}
        <div className={menu ? "menu open" : "menu closed"}>
          <div className="boundary" />
          <Menu
            datetime={datetime}
            open={menu}
            toggleAbout={this.toggleAbout}
            toggleMenu={this.toggleMenu}
            snowlines={snowlines}
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
              geojson={snowlines}
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
