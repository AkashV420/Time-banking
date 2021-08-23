import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css'
import Appl from './components/App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

const routes = (
  <BrowserRouter>
    <Switch>
      <Route path="/home" component={Appl} />
      <Redirect from="/" to="/home" />
    </Switch>
  </BrowserRouter>
);

ReactDOM.render(routes, document.getElementById("root"));

serviceWorker.unregister();

