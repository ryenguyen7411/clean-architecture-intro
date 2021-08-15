import { createAction } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { iife } from 'utils/helpers';

export const KeywordPlanningSearchAction = iife(() => {
  const type = '@redux/SEARCH_KEYWORD_PLANNING';
  return {
    PENDING: createAction(type + '_PENDING'),
    FAILED: createAction(type + '_FAILED'),
    SUCCESS: createAction(type),
  };
});

export default function KeywordPlanningRepo () {
  const dispatch = useDispatch();

  this.searchKeywordPlanning = function (params) {
    const key = encodeURIComponent(params.input);

    // TODO: check should fetch

    async function handler () {
      // return callAPI({

      // })

      const body = { data: [1, 2, 3, 4, 5], pagination: { total: 10, limit: 5, page: 1 } };
      const { data, ...extras } = body;
      return [null, data, extras];
    }

    return [
      handler,
      () => dispatch(KeywordPlanningSearchAction.PENDING({ key })),
      (error) => dispatch(KeywordPlanningSearchAction.FAILED({ key, error })),
      (data, extras) => dispatch(KeywordPlanningSearchAction.SUCCESS({ key, data, ...extras })),
    ];
  };
}
