import immerProduce from 'immer';
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

export function produce (initialState, callback) {
  if (typeof callback !== 'function') return immerProduce(initialState, () => {});
  return immerProduce(initialState, callback);
}

export const initialState = produce({});

export function setPending (state, key, { keep } = {}) {
  if (state[key] && keep) state[key] = { ...state[key], status: 'PENDING' };
  else state[key] = { status: 'PENDING' };
}

export function setError (state, key, { keep } = {}) {
  if (state[key] && keep) state[key] = { ...state[key], status: 'ERROR' };
  else state[key] = { status: 'ERROR' };
}

export function setData (state, key, data, { pagination, refs = [] } = {}) {
  state[key] = { status: 'SUCCESS', data };
  if (pagination) state[key].pagination = pagination;

  refs.forEach((ref) => {
    state[ref] = key;
  });
}
