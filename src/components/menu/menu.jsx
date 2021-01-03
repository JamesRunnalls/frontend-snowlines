import React, { Component } from "react";
import Eye from "./img/eye.svg";
import Settings from "./img/settings.svg";
import Download from "./img/download.svg";

class Selector extends Component {
  state = {
    selected: "Snowlines",
  };
  changeSelected = (selected) => {
    this.setState({ selected });
  };
  render() {
    var titles = ["Snowlines", "Satellite", "SLF"];
    var { snowlines, satellites, changeObjectProperty } = this.props;
    var { selected } = this.state;
    return (
      <React.Fragment>
        <div className="titles">
          {titles.map((t) => {
            return (
              <div
                key={t}
                onClick={() => {
                  this.changeSelected(t);
                }}
                className={t === selected ? "title active" : "title"}
              >
                {t}
              </div>
            );
          })}
        </div>
        <div className="contents">
          <div
            className={"Snowlines" === selected ? "content" : "content hide"}
          >
            {snowlines.map((s, index) => {
              return (
                <table className="list" key={s.url}>
                  <tbody>
                    <tr>
                      <td
                        onClick={() =>
                          changeObjectProperty(
                            "snowlines",
                            snowlines,
                            index,
                            "display",
                            !s.display
                          )
                        }
                      >
                        <img
                          src={Eye}
                          alt="Visibility"
                          className={s.display ? "image" : "image fade"}
                          title="Toggle Visibility"
                        />
                      </td>
                      <td>{`Snowline generated at ${s.time}`}</td>
                      <td>
                        <img
                          src={Settings}
                          alt="Settings"
                          className="image fade"
                          title="Settings"
                        />
                      </td>
                      <td>
                        <a href={s.url}>
                          <img
                            src={Download}
                            alt="Download"
                            className="image fade"
                            title="Download as GeoJSON"
                          />
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              );
            })}
          </div>
          <div
            className={"Satellite" === selected ? "content" : "content hide"}
          >
            {satellites.map((s, index) => {
              return (
                <table className="list" key={s.name}>
                  <tbody>
                    <tr>
                      <td
                        onClick={() =>
                          changeObjectProperty(
                            "satellites",
                            satellites,
                            index,
                            "display",
                            !s.display
                          )
                        }
                      >
                        <img
                          src={Eye}
                          alt="Visibility"
                          className={s.display ? "image" : "image fade"}
                          title="Toggle Visibility"
                        />
                      </td>
                      <td>{`${s.type}, ${s.satellite} at ${s.time}`}</td>
                      <td>
                        <img
                          src={Settings}
                          alt="Settings"
                          className="image fade"
                          title="Settings"
                        />
                      </td>
                      <td>
                        <a href={s.url}>
                          <img
                            src={Download}
                            alt="Download"
                            className="image fade"
                            title="Download as Geotiff"
                          />
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              );
            })}
          </div>
          <div className={"SLF" === selected ? "content" : "content hide"}>
            We are working to add the snow maps from{" "}
            <a href="https://www.slf.ch/en/index.html">
              WSL Institute for Snow and Avalanche Research
            </a>{" "}
            (SLF) to Snowlines.ch, however as the data is not "Open Data" we are
            trying to reach an agreement with SLF and will bring you this data
            as soon as we get permission.
          </div>
        </div>
      </React.Fragment>
    );
  }
}

class DateFormat extends Component {
  render() {
    var { datetime } = this.props;
    return (
      <table>
        <tbody>
          <tr>
            <td rowSpan="2" style={{ fontSize: "110px" }}>
              {datetime.getDate()}
            </td>
            <td style={{ fontSize: "40px", verticalAlign: "bottom" }}>
              {datetime.toLocaleString("default", { month: "short" })}
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: "40px", verticalAlign: "top" }}>
              {datetime.getFullYear()}
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

class Menu extends Component {
  state = {};
  render() {
    var {
      datetime,
      toggleAbout,
      toggleMenu,
      open,
      satellites,
      snowlines,
      changeObjectProperty,
    } = this.props;

    return (
      <React.Fragment>
        {open ? (
          <React.Fragment>
            <div className="date">
              <DateFormat datetime={datetime} />
            </div>
            <div className="tagline">
              <div className="line1">Snowlines for Switzerland</div>
              <div className="line2">Mapping Snow from Satellite Imagery</div>
            </div>
            <div className="selector">
              <Selector
                snowlines={snowlines}
                satellites={satellites}
                changeObjectProperty={changeObjectProperty}
              />
            </div>
            <div className="buttons">
              <button className="white" onClick={toggleMenu}>
                Hide Menu
              </button>
              <button className="blue" onClick={toggleAbout}>
                Learn More
              </button>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="closed" onClick={toggleMenu} title="Open Menu">
              &#9776;
              <div className="rotate">
                Snowline for {datetime.toDateString()}
              </div>
            </div>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default Menu;
