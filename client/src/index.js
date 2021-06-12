import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Home, Room } from "./components";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/" render={(props) => <Home {...props} />} />
          <Route path="/rooms/:id" render={(props) => <Room {...props} />} />
        </Switch>
      </Router>
    </>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
