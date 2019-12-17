import React from 'react';
import { render, hydrate } from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';

import App from './App';
import client from 'config/apolloClient';
import './stylesheets/bootstrap-utilities.css';
import './stylesheets/app.css';

import momentConfig from 'config/momentConfig';

momentConfig();

const rootElement: HTMLElement | null = document.getElementById('root');
const AppRenderer = (rootElement && rootElement.hasChildNodes()) ? hydrate : render;

AppRenderer(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>,
  rootElement,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
