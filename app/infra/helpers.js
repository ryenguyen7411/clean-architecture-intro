import { iife } from 'utils/helpers';

function injectParams (url, { params, query } = {}) {
  if (!url) return console.error('Empty url', url, params);
  let parsedUrl = url;

  if (params) {
    Object.keys(params).forEach((key) => {
      parsedUrl = parsedUrl.replace('#{' + key + '}', params[key]);
    });
    if (parsedUrl.indexOf('$') > -1) console.error('Missing params for url', parsedUrl, params);
  }
  if (query) {
    const parsedQuery = new URLSearchParams(query);
    parsedUrl = parsedUrl + '?' + parsedQuery.toString();
  }

  return parsedUrl;
}

export async function callAPI ({ method, url, params, query, body, additionalHeaders, accessToken, ...extras }) {
  const fetchAPI = iife(() => {
    if (typeof fetch !== 'undefined') return fetch;
    return require('node-fetch');
  });

  const queryUrl = injectParams(url, { params, query });
  const options = {
    method: method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(additionalHeaders || {}),
    },
    body: body && JSON.stringify(body),
    ...extras,
  };

  const res = await fetchAPI(queryUrl, options);
  return res;
  // TODO: parse res to { body, status }
}
