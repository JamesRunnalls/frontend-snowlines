import React, { Component } from "react";
import explain from "./img/snowline.png";
import "../../App.css";

class About extends Component {
  render() {
    var { open, close } = this.props;
    return (
      <React.Fragment>
        {open && (
          <div className="about">
            <div className="close" onClick={close} title="Close">&#215;</div>
            <div className="inner">
              <h3>What is snowlines.ch?</h3>
              <p>
                The page comes from a great idea we had in 2020. We wanted to
                create a website that shows the snowlines within Switzerland
                accurately and updated every day.
              </p>
              <h3>What is a snowline?</h3>
              <p>
                A snowline is the line that divides regions of snow from regions
                of no snow. Regions of snow are usually higher in altitude than
                regions without snow. They also tend to be facing north and not
                south. Regions of snow can also include land or water that is
                covered in ice, like frozen lakes and glaciers.
              </p>
              <img className="image" src={explain} alt="Snowline explained" />
              <h3>Why should I care where the snowlines are?</h3>
              <p>
                If you stay at home, you don't need to care. However, we
                discovered in the past that such information can be very useful:
                Where can I skitour or snowshoe-hike? The snowlines are a good
                indicator of where there is enough snow to start a ski tour or a
                hike with snow shoes. Be aware that being above the snowline
                does not mean you will be immediately in deep powder snow! On
                the other hand, maybe you're planing and hike and do not want to
                be stuck in snow and exposed to the elements above the snow
                line. You can check here if there is a risk of ending up in the
                snow.
              </p>

              <h3>How is the snow line produced? </h3>
              <p>
                The snowlines are produced from images that are shot by
                satellites from the European Space Agency (ESA), most notably
                the Sentinel-3 satellite constellation. These satellites shoot
                new images of Switzerland every day that we download and process
                using the Sentinel Application Platform and our own code and our
                own code.
              </p>
              <h3>How accurate are the snowlines?</h3>
              <p>
                Sentinel-3 satellites have a resolution of 300 meters per pixel,
                which is also roughly the accuracy of the snowlines we show. We
                are working on more accurate predictions by incorporating data
                from other satellites, such as images from Sentinel-2 satellite
                which has a greater resolution. Our snowlines are updated daily,
                but heavy cloud cover can mean that the snowlines have not been
                updated in some regions because snow and ice reflections are
                obscured.
              </p>
              <h3>Who are we?</h3>
              <p>
                <b>James Runnalls</b>: I am a Software Developer working at{" "}
                <a href="https://www.eawag.ch/">Eawag</a>, I work mostly in
                Javascript and Python developing software and websites for
                processing and analysing environmental data.
              </p>
              <p>
                <b>Leonid Kahle</b>: I work at IBM Research Zurich as a
                Postdoctoral Fellow, researching natural language processing and
                machine-learning applications. In my free time, I enjoy
                climbing, hiking and ski touring. I live in Zurich since 2020
                and in Switzerland since 2013.
              </p>
              <h3>How can I contribute?</h3>
              <p>
                Our code can be found on{" "}
                <a href="https://github.com/JamesRunnalls/frontend-snowlines/">
                  https://github.com/JamesRunnalls/frontend-snowlines/
                </a>{" "}
                and{" "}
                <a href="https://github.com/lekah/snowline/">
                  https://github.com/lekah/snowline/
                </a>{" "}
                and we are very happy for contributions.
              </p>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default About;
