import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import { iife } from 'utils/helpers';

const initialState = iife(() => {
  try {
    return JSON.parse(globalThis.__INITIAL_STATE__);
  } catch {}
});

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialState,
  devTools: process.env.NODE_ENV !== 'production',
});

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./rootReducer', () => {
    const newRootReducer = require('./rootReducer').default;
    store.replaceReducer(newRootReducer);
  });
}

export function getServerStore (initialServerState) {
  return configureStore({
    reducer: rootReducer,
    preloadedState: initialServerState,
  });
}

export { Provider } from 'react-redux';
