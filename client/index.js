import { Provider, store } from 'infra/storage';
import React from 'react';
import ReactDOM from 'react-dom';

if (process.env.BROWSER) {
  require('assets/styles/index.scss');
}

function renderApp () {
  const App = require('./app').default;
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('body'),
  );
}

renderApp();

if (module.hot) module.hot.accept();
