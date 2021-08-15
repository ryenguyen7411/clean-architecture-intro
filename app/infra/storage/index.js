import { configureStore } from '@reduxjs/toolkit';
import { iife } from 'utils/helpers';
import rootReducer from './root-reducer';

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
  module.hot.accept('./root-reducer', () => {
    const newRootReducer = require('./root-reducer').default;
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
