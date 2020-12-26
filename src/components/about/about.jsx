import React, { Component } from "react";
import "../../App.css";

class About extends Component {
  state = {
    open: false,
  };

  toggle = () => {
    this.setState({ open: !this.state.open });
  };
  render() {
    var { title, body } = this.props;
    var { open } = this.state;
    return (
      <React.Fragment>
        <div>
          <div className="about-title" onClick={this.toggle}>
            {title}
          </div>
          {open && <div className="about-body">{body}</div>}
        </div>
      </React.Fragment>
    );
  }
}

export default About;
