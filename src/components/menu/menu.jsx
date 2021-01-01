import React, { Component } from "react";

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
            <td style={{ fontSize: "40px", verticalAlign: "bottom" }}>{datetime.toLocaleString('default', { month: 'short' })}</td>
          </tr>
          <tr>
            <td style={{ fontSize: "40px", verticalAlign: "top" }}>{datetime.getFullYear()}</td>
          </tr>
        </tbody>
      </table>
    );
  }
}

class Menu extends Component {
  state = {};
  render() {
    var { datetime } = this.props;
    return (
      <React.Fragment>
        <div className="date">
          <DateFormat datetime={datetime} />
        </div>
        <div className="tagline">
          <div className="line1">Snowline for Switzerland</div>
          <div className="line2">Mapping Snow from Satellite Imagery</div>
        </div>
      </React.Fragment>
    );
  }
}

export default Menu;
