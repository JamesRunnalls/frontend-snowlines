import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/home";
import NotFound from "./pages/notfound/notfound";
import ReactGA from "react-ga";
ReactGA.initialize("G-8EPEJKZPC5");
ReactGA.pageview(window.location.pathname + window.location.search);

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/" component={NotFound} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
