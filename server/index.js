import cookieParser from 'cookie-parser';
import * as eta from 'eta';
import express from 'express';
import path from 'path';
import { iife } from 'utils/helpers';
import preProcessMiddleware from './middlewares/preprocess';
import getRoutes from './routes';

globalThis.resourceStats = iife(() => {
  try {
    if (process.env.NODE_ENV !== 'production') throw new Error('Development mode');
    return require('./metadata/resource-stats.json'); // eslint-disable-line import/no-unresolved
  } catch (e) {
    return { bundle: 'bundle.js' };
  }
});

eta.configure({
  tags: ['{{', '}}'],
});

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('eta', eta.renderFile);
app.set('view engine', 'eta');
app.set('views', path.join(__dirname, 'views'));

app.use(preProcessMiddleware);

const routes = getRoutes();
routes.forEach((route) => {
  app[route.method](route.path, route.handler);
});

export default app;
