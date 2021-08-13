import { Route, Switch, matchPath } from 'react-router-dom';
import React from 'react';

function ResolvedRoute (props) {
  const route = __resolveRoute(props, props.computedMatch);
  if (!route.component) return null;
  return (
    <Route
      path={route.path}
      exact={route.isExact}
      render={(cProps) => <route.component {...route.component.defaultProps} {...cProps} />}
    />
  );
}

function __parseRoutePath (path, basePath = '') {
  function tokenize (cPath) {
    return cPath.split('{').flatMap((c) => {
      if (c.split('}')[1]) {
        const res = c.split('}');
        res[0] += '}';
        return res;
      }
      return c;
    });
  }
  function parsing (token, idx = 0) {
    if (idx >= token.length) return [];
    if (idx === token.length - 1) {
      if (token[idx].includes('}')) return [token[idx].split('}')[0], ''];
      return [token[idx]];
    }

    const childParsed = parsing(token, idx + 1);
    return childParsed.flatMap((c) => {
      if (token[idx].includes('}')) return [token[idx].split('}')[0] + c, c];
      return [token[idx] + c];
    });
  }

  if (Array.isArray(path)) {
    return path.flatMap((cPath) => {
      const cToken = tokenize(cPath);
      return parsing(cToken).map((p) => basePath + p);
    });
  }

  const token = tokenize(path);
  return parsing(token).map((p) => basePath + p);
}
function __isMatch (pathname, route, resolved = '') {
  if (route.exact && pathname !== route.path) return false;
  return pathname.indexOf(`${resolved}${route.path}`) === 0; // match beginning of pathname
}
function __getRoute ({ routes, pathname, exact, resolved = '' }) {
  const route = routes.find((r) => __isMatch(pathname, r, resolved));
  if (!route) return {};

  const isMatchExact = exact === !!route.exact;
  const remainPath = (() => {
    if (pathname === '/' && route.path === '/') return '';
    if (route.path === '/') return pathname;
    return pathname.split(route.path)[1];
  })();

  if (!remainPath && isMatchExact) return { ...route, id: `route-${route.path}-${exact}` };
  return __getRoute({
    routes: route.routes,
    pathname,
    exact,
    resolved: `${resolved}${route.path !== '/' ? route.path : ''}`,
  });
}
function __resolveRoute (route, match, compact = false) {
  if (!route || !match) return {};

  const res = { ...route };
  if (typeof res.resolver === 'function') {
    const resolvedComponent = res.resolver(match);
    res.component = resolvedComponent;
    compact && delete res.resolver;
  }
  if (!res.component || compact) return res;
  res.component.defaultProps = {
    ...res.component.defaultProps,
    children: render({ path: res.path, exact: res.exact, topLevel: false }),
  };
  return res;
}
function __resolveRouteCompact (route, match) {
  return __resolveRoute(route, match, true);
}

export function render ({ routes: oRoutes, originalUrl: oUrl, path, exact = false, topLevel = true }) {
  const routes = oRoutes || (global && global.__routes);
  const originalUrl = oUrl || (global && global.__originalUrl) || '/';
  if (!Array.isArray(routes)) return null;

  // get current path, or base path from routes
  const resolvedPath = (() => {
    if (path) return path[0] || path;
    const topLevelPaths = routes.map((route) => route.path);
    return topLevelPaths.find((topLevelPath) => originalUrl.indexOf(topLevelPath) === 0);
  })();

  const currentRoute = __getRoute({ routes, pathname: resolvedPath, exact });
  const childRoutes = (() => {
    if (topLevel) return [currentRoute];
    if (!Array.isArray(currentRoute.routes)) return null;

    const basePath = resolvedPath !== '/' ? resolvedPath : '';
    return currentRoute.routes.map((route) => ({ ...route, path: __parseRoutePath(route.path, basePath) }));
  })();

  if (!Array.isArray(childRoutes)) return null;
  return (
    <Switch>
      {childRoutes.map((route) => (
        <ResolvedRoute key={route.path} {...route} />
      ))}
    </Switch>
  );
}

export function matchRoutes (routes, pathname, branch = []) {
  if (!Array.isArray(routes)) return [];
  routes.some((route) => {
    const match = (() => {
      if (!route.path && !branch.length) return { path: '/', url: '/', params: {}, isExact: pathname === '/' };
      if (!route.path) return branch[branch.length - 1].match;
      if (!branch.length) return matchPath(pathname, route);

      const basePath = branch[branch.length - 1].match.path !== '/' ? branch[branch.length - 1].match.path : '';
      const resolvedPath = __parseRoutePath(route.path, basePath);
      let fullPath = null;

      if (Array.isArray(resolvedPath)) fullPath = resolvedPath.find((path) => !!matchPath(pathname, { ...route, path }));
      else fullPath = resolvedPath;
      return matchPath(pathname, { ...route, path: fullPath });
    })();

    if (match) {
      branch.push({ match, route: __resolveRouteCompact(route, match) });
      if (Array.isArray(route.routes)) matchRoutes(route.routes, pathname, branch);
    }
    return match;
  });
  return branch;
}

export function getRoute (oRoutes, pathname) {
  const routes = oRoutes || (global && global.__routes);
  const matched = matchRoutes(routes, pathname);
  if (!matched.length) return {};
  return matched[matched.length - 1];
}

// TODO: maybe it broken for array path
export function compilePath (path, params) {
  let resPath = path;
  Object.keys(params).forEach((p) => {
    if (resPath.includes(`:${p}`)) resPath = resPath.replace(`:${p}`, params[p]);
  });

  return resPath
    .split('{')
    .map((c) => {
      const tmp = c.split('}');
      if (c.includes(':')) return tmp[1] || '';
      return tmp[0] + (tmp[1] || '');
    })
    .join('');
}

export function register (routes, originalUrl) {
  if (global) {
    global.__routes = routes;
    global.__originalUrl = originalUrl;
  }
}

export function unregister () {
  if (global) {
    delete global.__routes;
    delete global.__originalUrl;
  }
}
