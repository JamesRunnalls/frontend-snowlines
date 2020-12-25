import React, { Component } from "react";
import logo from "./img/logo3.png";
import "../../App.css";

class Header extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <img src={logo} className="loading-logo fade-in" alt="Snowlines logo" />
      </React.Fragment>
    );
  }
}

export default Header;
