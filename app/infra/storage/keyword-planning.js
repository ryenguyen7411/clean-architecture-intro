import { createAction, createReducer } from '@reduxjs/toolkit';
import { initialState, setPending, setError, setData } from 'infra/helpers';
import { useSelector } from 'infra/storage';
import { iife } from 'utils/helpers';

const storage = new KeywordPlanningStorage();

const reducer = createReducer(initialState, {
  ...storage.search.handlers,
});

export default function KeywordPlanningStorage () {
  this.getReducer = () => reducer;

  this.getKeywordPlanning = (input) => {
    const key = encodeURIComponent(input);
    return useSelector((state) => state.keywordPlanning[key]);
  };

  this.getCurrentSearchKeyword = () => {
    return useSelector((state) => state.keywordPlanning.currentKeyword);
  };

  this.search = iife(() => {
    const type = '@action/search_keyword_planning';
    const PENDING = createAction(type + '_PENDING');
    const FAILED = createAction(type + '_FAILED');
    const SUCCESS = createAction(type);

    return {
      actions: [SUCCESS, PENDING, FAILED],
      handlers: {
        [PENDING]: (state, action) => {
          if (!action.payload?.key) return;
          const { key } = action.payload;
          setPending(state, key);
        },
        [FAILED]: (state, action) => {
          if (!action.payload?.key) return;
          const { key } = action.payload;
          setError(state, key);
        },
        [SUCCESS]: (state, action) => {
          if (!action.payload?.key) return;
          const { key, data, pagination } = action.payload;
          setData(state, key, data, { pagination });

          state.currentKeyword = decodeURIComponent(key);
        },
      },
    };
  });
}
