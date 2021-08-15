import { KeywordPlanningSearchAction } from 'infra/keyword-planning';
import { createReducer } from '@reduxjs/toolkit';
import { initialState, setPending, setError, setData } from 'infra/helpers';

export default createReducer(initialState, {
  [KeywordPlanningSearchAction.PENDING]: (state, action) => {
    if (!action.payload?.key) return;
    const { key } = action.payload;
    setPending(state, key);
  },
  [KeywordPlanningSearchAction.FAILED]: (state, action) => {
    if (!action.payload?.key) return;
    const { key } = action.payload;
    setError(state, key);
  },
  [KeywordPlanningSearchAction.SUCCESS]: (state, action) => {
    if (!action.payload?.key) return;
    const { key, data, pagination } = action.payload;
    setData(state, key, data, { pagination });
  },
});
