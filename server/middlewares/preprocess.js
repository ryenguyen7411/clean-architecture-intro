import { detectMobileDevice } from 'utils/helpers';
import { matchRoutes } from 'utils/routing';
import getServerRoutes from '../routes';
import { GoogleAdsApi, services } from 'google-ads-api';
import { KeywordPlanningSearchAction } from 'repo/keyword-planning';
import { getServerStore } from 'infra/storage';

function handleStats (req, res) {
  globalThis.host = req.header('host');
  res.locals.stats = {
    resourceStats: globalThis.resourceStats,
  };
}

async function handleCoreData (req, res) {
  // const store = getServerStore(res.locals.initialServerState);
  // try {
  //   if (req.path !== '/') return;
  //   const adsClient = new GoogleAdsApi({
  //     client_id: '157633396378-3on908m1dkk3eij08rj406ep73tv7d1l.apps.googleusercontent.com',
  //     client_secret: 'kDuhzII0JI6LiV5ENfGeXhyX',
  //     developer_token: 'wdVfk_U_BggifJUCC7c_5A',
  //   });

  //   const customer = adsClient.Customer({
  //     customer_account_id: '4513750443',
  //     refresh_token: '1//0eR4694p-34XQCgYIARAAGA4SNwF-L9Irt-EdPgftP-JD2IJRw9IaJNjrane7uC-GfwknLlnPnTFLuxj4uTcTrQwlw8UU2nGfkiU',
  //   });

  //   const generateKeywordIdeaResponse = await customer.keywordPlanIdeas.generateKeywordIdeas({
  //     customer_id: '4513750443',
  //     page_size: 10,
  //     keyword_seed: new services.KeywordSeed({ keywords: ['content marketing'] }),
  //   }).catch((e) => console.error(e));

  //   console.log('HELLO', JSON.stringify(generateKeywordIdeaResponse, null, 2));
  // } catch (e) {
  //   console.log('ERROR:', e);
  // }

  // res.locals.initialServerState = store.getState();
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
