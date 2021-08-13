import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from 'store';

if (process.env.BROWSER) {
  require('assets/lzFonts.font');
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
