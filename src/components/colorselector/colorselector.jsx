import React, { Component } from "react";

class ColorSelector extends Component {
  render() {
    var colors = [
      "white",
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "indigo",
      "violet",
      "black",
    ];
    var width = 100 / colors.length;
    var { onChange, value } = this.props;
    return (
      <div className="color-selector" title="Select Color">
        {colors.map((c) => (
          <div
            key={c}
            className={c === value ? "inner-color active" : "inner-color"}
            style={{ width: width + "%", backgroundColor: c }}
            onClick={() => onChange(c)}
          ></div>
        ))}
      </div>
    );
  }
}
 
export default ColorSelector;