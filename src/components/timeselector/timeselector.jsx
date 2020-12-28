import React, { Component } from "react";
import * as d3 from "d3";
import Loading from "../loading/loading";

class TimeSelector extends Component {
  state = {
    min: false,
    max: false,
  };
  onChangeState = (min, max) => {
    this.setState({ min, max });
  };
  plotLineGraph = async (resize) => {
    try {
      d3.select("#timeselectorsvg").remove();
    } catch (e) {}
    var { datearray, datetime, onChangeDatetime, daysize } = this.props;
    try {
      // Set graph size
      var { min, max } = this.state;
      var onChangeState = this.onChangeState;
      var margin = { top: 0, right: 10, bottom: 20, left: 0 },
        viswidth = d3.select("#timeselector").node().getBoundingClientRect()
          .width,
        visheight = 65,
        width = viswidth - margin.left - margin.right,
        height = visheight - margin.top - margin.bottom;

      // Format X-axis
      var x, xx;
      if (min && max && !resize) {
        x = d3.scaleTime().range([0, width]).domain([min, max]);
        xx = d3.scaleTime().range([0, width]).domain([min, max]);
      } else {
        var nodays = width / daysize;
        var maxdate = new Date(datetime.getTime() + nodays * 24 * 1200 * 1000);
        var mindate = new Date(datetime.getTime() - nodays * 24 * 2400 * 1000);
        x = d3.scaleTime().range([0, width]).domain([mindate, maxdate]);
        xx = d3.scaleTime().range([0, width]).domain([mindate, maxdate]);
      }

      // Define the axes
      var xAxis = d3.axisBottom(x).ticks(5);

      var zoom = d3
        .zoom()
        .scaleExtent([1, 1])
        .extent([
          [0, 0],
          [width, height],
        ])
        .on("zoom", zoomed);

      function zoomed() {
        x.domain(d3.event.transform.rescaleX(xx).domain());
        gX.call(xAxis);
        plotSquares();
        hover.attr("x", x(hover_datetime) + 4);
      }

      // Adds the svg canvas
      var svg = d3
        .select("#timeselector")
        .append("svg")
        .attr("id", "timeselectorsvg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoom);

      // Add the X Axis
      var gX = svg
        .append("g")
        .attr("class", "xaxis")
        .attr("id", "axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      svg
        .append("rect")
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr("width", width)
        .attr("height", height + margin.bottom)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseout", mouseout)
        .on("click", onClick);

      var ds = 24 * 3600 * 1000;
      var hover_datetime = new Date(Math.floor(datetime.getTime() / ds) * ds);
      var hover = svg
        .append("g")
        .attr("class", "hover")
        .attr("id", "hover")
        .append("rect")
        .attr("height", 36)
        .attr("width", daysize / 2 + 7)
        .attr("fill", "transparent")
        .attr("stroke", "white")
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("x", x(hover_datetime) + 4)
        .attr("y", 2);

      var squares = svg
        .append("g")
        .attr("class", "squares")
        .attr("id", "squares");
      plotSquares();

      function onClick() {
        var date = x.invert(d3.mouse(this)[0]);
        if (typeof date.getMonth === "function") {
          onChangeDatetime(date);
        }
      }

      function plotSquares() {
        d3.select("#squares").selectAll("*").remove();
        var min = Math.ceil(x.domain()[0].getTime() / ds) * ds;
        var max = Math.floor(x.domain()[1].getTime() / ds) * ds;

        for (let i = 0; i < Math.round((max - min) / ds); i++) {
          let rect = squares
            .append("rect")
            .attr("height", 30)
            .attr("width", daysize / 2)
            .attr("fill", "rgba(255,255,255,0.2)")
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("x", x(new Date(min + (i + 0.25) * ds)))
            .attr("y", 5)
            .on("mouseover", function () {
              d3.select("#datevalue").node().innerHTML = new Date(
                min + i * ds
              ).toDateString();
              hover.attr("x", x(new Date(min + i * ds)) + 4);
            });

          if (datearray.includes(min + i * ds)) {
            rect.attr("fill", "rgba(255,255,255,0.9)").on("click", function () {
              onChangeState(x.domain()[0], x.domain()[1]);
              onChangeDatetime(new Date(min + (i + 0.5) * ds));
            });
          } else {
            rect.on("click", function () {
              let d = new Date(min + (i + 0.5) * ds).toDateString();
              alert("No Snowline for " + d);
            });
          }
        }
      }

      function mouseover() {}

      function mouseout() {
        d3.select("#datevalue").node().innerHTML = datetime.toDateString();
        hover.attr("x", x(hover_datetime) + 4);
      }

      function mousemove(event) {}
    } catch (e) {
      console.error("Error plotting time selector", e);
    }
  };

  resize = () => {
    this.plotLineGraph(true);
  };
  componentDidMount() {
    this.plotLineGraph();
    window.addEventListener("resize", this.resize, false);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize, false);
  }

  componentDidUpdate(prevProps, prevState) {
    this.plotLineGraph();
  }
  render() {
    var { datetime } = this.props;
    return (
      <div id="timeselector">
        <div className="gradient" />
        <div id="datevalue" className="datevalue">
          {datetime.toDateString()}
        </div>
        <div className="loading" id="time-loading">
          <Loading />
        </div>
      </div>
    );
  }
}

export default TimeSelector;
