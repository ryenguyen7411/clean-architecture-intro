import { detectMobileDevice } from 'utils/helpers';
import { matchRoutes } from 'utils/routing';
import getServerRoutes from '../routes';

function handleStats (req, res) {
  globalThis.host = req.header('host');
  res.locals.stats = {
    resourceStats: globalThis.resourceStats,
  };
}

async function handleCoreData () {
}

export default async function preProcessMiddleware (req, res, next) {
  handleStats(req, res);
  const serverRoutes = getServerRoutes({ asteriskToNoExact: true });

  const originalUrl = req.baseUrl + req.path;
  const matchedServer = matchRoutes(serverRoutes, originalUrl);
  const { match: matchServerRoute } = matchedServer[matchedServer.length - 1] || {};

  if (matchServerRoute?.path === '/') {
    res.locals.device = detectMobileDevice(req.headers['user-agent']);
    process.env.AGENT = res.locals.device;

    await handleCoreData(req, res);
    res.locals.serverParams = {};
  }

  return next();
}
