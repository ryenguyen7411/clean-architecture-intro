import { createAction } from '@reduxjs/toolkit';

export default function KeywordPlanningSearchInfra () {
  this.searchKeywordPlanning = function ({ dispatch, params }) {
    const type = '@redux/SEARCH_KEYWORD_PLANNING';
    const key = `keywordPlanning.${encodeURIComponent(params.input)}`;

    const PENDING = createAction(type + '_PENDING');
    const FAILED = createAction(type + '_FAILED');
    const SUCCESS = createAction(type + '_SUCCESS');

    async function handler () {
      // return callAPI({

      // })

      const body = { data: [1, 2, 3, 4, 5], pagination: { total: 10, limit: 5, page: 1 } };
      const { data, ...extras } = body;
      return [null, data, extras];
    }

    return [
      handler,
      () => dispatch(PENDING({ key })),
      (error) => dispatch(FAILED({ key, error })),
      (data, extras) => dispatch(SUCCESS({ key, data, ...extras })),
    ];
  };
}
