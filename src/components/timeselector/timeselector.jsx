import React, { Component } from "react";
import * as d3 from "d3";

class TimeSelector extends Component {
  plotLineGraph = async () => {
    try {
      d3.select("#timeselectorsvg").remove();
    } catch (e) {}
    var { datearray, datetime, onChangeDatetime, daysize } = this.props;
    try {
      // Set graph size
      var margin = { top: 0, right: 10, bottom: 20, left: 0 },
        viswidth = d3.select("#timeselector").node().getBoundingClientRect()
          .width,
        visheight = 60,
        width = viswidth - margin.left - margin.right,
        height = visheight - margin.top - margin.bottom;

      var nodays = width / daysize;
      var maxdate = new Date(datetime.getTime() + nodays * 24 * 1200 * 1000);
      var mindate = new Date(datetime.getTime() - nodays * 24 * 2400 * 1000);

      // Format X-axis
      var x = d3.scaleTime().range([0, width]).domain([mindate, maxdate]);
      var xx = d3.scaleTime().range([0, width]).domain([mindate, maxdate]);

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
        var ds = 24 * 3600 * 1000;
        var min = Math.ceil(x.domain()[0].getTime() / ds) * ds;
        var max = Math.floor(x.domain()[1].getTime() / ds) * ds;

        for (let i = 0; i < Math.round((max - min) / ds); i++) {
          squares
            .append("rect")
            .attr("height", 30)
            .attr("width", daysize / 2)
            .attr("fill", function () {
              if (datearray.includes(min + i * ds)) {
                return "rgba(255,255,255,0.9)";
              } else {
                return "rgba(255,255,255,0.2)";
              }
            })
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("x", x(new Date(min + (i + 0.25) * ds)))
            .attr("y", 0)
            .on({
              mouseover: function () {},
              mouseout: function () {},
              click: function () {
                onChangeDatetime(new Date(min + (i + 0.25) * ds));
              },
            });
        }
      }

      function mouseover() {}

      function mouseout() {}

      function mousemove(event) {}
    } catch (e) {
      console.error("Error plotting time selector", e);
    }
  };
  componentDidMount() {
    this.plotLineGraph();
    window.addEventListener("resize", this.plotLineGraph, false);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.plotLineGraph, false);
  }

  componentDidUpdate(prevProps, prevState) {
    this.plotLineGraph();
  }
  render() {
    return (
      <div id="timeselector">
        <div className="gradient" />
      </div>
    );
  }
}

export default TimeSelector;
