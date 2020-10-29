import React, { Component } from "react";
import Basemap from "../../graphs/leaflet/basemap";
import "./home.css";
import logo from "./img/logo.svg";

class Home extends Component {
  render() {
    document.title = "Snowlines";
    return (
      <React.Fragment>
        <main>
          <div className="pagecenter">
            <img
              src={logo}
              className="loading-logo fade-in"
              alt="Snowlines logo"
            />
            <div className="loading-text fade-in">
              Snowlines is under construction.
            </div>
            <div className="progress">
              <div className="progress-value"></div>
            </div>
          </div>
          <div className="main">
            <Basemap />
          </div>
        </main>
      </React.Fragment>
    );
  }
}

export default Home;
