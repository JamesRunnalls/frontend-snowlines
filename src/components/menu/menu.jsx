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
    var { datetime, toggleAbout, toggleMenu, open } = this.props;

    return (
      <React.Fragment>
        {open ? (
          <React.Fragment>
            <div className="date">
              <DateFormat datetime={datetime} />
            </div>
            <div className="tagline">
              <div className="line1">Snowline for Switzerland</div>
              <div className="line2">Mapping Snow from Satellite Imagery</div>
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
            <div className="closed" onClick={toggleMenu}>
              &#9776;
              <div className="rotate">Snowline for {datetime.toDateString()}</div>
            </div>

          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default Menu;
