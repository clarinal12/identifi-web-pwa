import React from "react";
import { render, hydrate } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";

import App from "./App";
import "bootstrap-utilities/bootstrap-utilities.css";
import "./stylesheets/app.css";

import appConfig from "config/appConfig";

appConfig();

const rootElement: HTMLElement | null = document.getElementById("root");
const AppRenderer = rootElement?.hasChildNodes() ? hydrate : render;

AppRenderer(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  rootElement
);

// If you want your app to work offline and load faster, you can chasnge
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
