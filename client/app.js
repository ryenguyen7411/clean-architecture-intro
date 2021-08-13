import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import getRoutes from 'routes';
import { register, render as renderRoutes } from 'utils/routing';

const routes = getRoutes();

function App () {
  register(routes, window.location.pathname);
  return <BrowserRouter>{renderRoutes({ routes, originalUrl: window.location.pathname })}</BrowserRouter>;
}

export default App;
