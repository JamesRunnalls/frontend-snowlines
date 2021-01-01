import React, { Component } from "react";

class Menu extends Component {
  state = {};
  render() {
    var { datetime } = this.props;
    return <div>
        <div className="datetime"></div>
    </div>;
  }
}

export default Menu;
