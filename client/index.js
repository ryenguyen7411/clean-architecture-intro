import { Provider, store } from 'infra/storage';
import React, { ReactDOM } from 'infra/renderer';

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
