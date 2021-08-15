import React, { ReactDOMServer } from 'infra/renderer';
import { StaticRouter } from 'infra/router';
import { getServerStore, Provider } from 'infra/storage';
import Helmet from 'react-helmet';
import getRoutes from 'routes';
import { matchRoutes, register, render as renderRoutes } from 'utils/routing';

export async function serve (req, res) {
  const store = getServerStore();
  const routes = getRoutes();

  const originalUrl = req.baseUrl + req.path;
  const matchedRoutes = matchRoutes(routes, originalUrl);
  const { match } = matchedRoutes[matchedRoutes.length - 1] || {};
  register(routes, originalUrl);

  function renderView () {
    const context = {};
    const body = ReactDOMServer.renderToString(
      <Provider store={store}>
        <StaticRouter location={req.url} context={context}>
          {renderRoutes({
            routes,
            path: matchedRoutes[0] && matchedRoutes[0].route.path,
            originalUrl,
          })}
        </StaticRouter>
      </Provider>,
    );
    const state = JSON.stringify(store.getState());

    // Set metadata & render
    const header = Helmet.rewind();
    const title = header.title.toString();
    const meta = header.meta.toString();
    const link = header.link.toString();
    const lang = 'vi';

    const viewData = {
      title, meta, link, lang,
      body, state,
      version: res.locals.version,
      availableAreas: JSON.stringify(global.availableAreas),
      env: process.env.NODE_ENV,
      ...res.locals.stats,
    };
    return res.render('main', viewData);
  }

  function renderNotFound () {
    const matchNotFoundRoutes = matchRoutes(routes, '/khong-tim-thay');

    const context = {};
    const body = ReactDOMServer.renderToString(
      <Provider store={store}>
        <StaticRouter location={req.url} context={context}>
          {renderRoutes({
            routes,
            path: matchNotFoundRoutes[0] && matchNotFoundRoutes[0].route.path,
            originalUrl: '/khong-tim-thay',
          })}
        </StaticRouter>
      </Provider>,
    );
    const state = JSON.stringify(store.getState());

    // Set metadata & render
    const header = Helmet.rewind();
    const title = header.title.toString();
    const meta = header.meta.toString();
    const link = header.link.toString();
    const lang = 'vi';

    const viewData = {
      title, meta, link, lang,
      body, state,
      version: res.locals.version,
      availableAreas: JSON.stringify(global.availableAreas),
      env: process.env.NODE_ENV,
      ...res.locals.stats,
    };
    return res.status(404).render('main', viewData);
  }

  function handleError (e) {
    switch (e.status) {
      case 404:
        return renderNotFound();
      default:
        console.error('Requested URL:', originalUrl || req.url);
        console.error('Timestamp:', new Date());
        console.error('ERROR', e.status || '', ':', { type: e.type, params: e.params });
        if (e.stack) {
          if (e.filename) console.error(`Error at ${e.filename}:${e.lineNumber}:${e.columnNumber}`);
          console.error(e.stack);
        } else {
          console.error('ERROR THROWN:', JSON.stringify(e || {}));
        }
        console.error('-----------------------------');
        return res.status(503).render('fainted', {});
    }
  }

  async function serverPrefetch ({ dispatch, params, query }) {
    const prefetchs = matchedRoutes
      .reduce((acc, { route }) => {
        if (!route.serverPrefetch) return acc;
        if (!Array.isArray(route.serverPrefetch)) return [...acc, route.serverPrefetch];
        return [...acc, ...route.serverPrefetch];
      }, [])
      .filter((prefetch) => typeof prefetch === 'function');

    return Promise.all(prefetchs.map((prefetch) => dispatch(prefetch(params, query))));
  }

  try {
    await serverPrefetch({
      dispatch: store.dispatch,
      params: {
        ...match?.params, ...res.locals.serverParams,
      },
      query: req.query,
    });
    renderView();
  } catch (e) {
    handleError(e);
  }
}
