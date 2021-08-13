import express from 'express';
import cookieParser from 'cookie-parser';
import routes from './routes';
import * as eta from 'eta';

eta.configure({
  tags: ['{{', '}}'],
});

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('eta', eta.renderFile);
app.set('view engine', 'eta');
app.set('views', './views');

routes.forEach((route) => {
  app[route.method](route.path, route.handler);
});
