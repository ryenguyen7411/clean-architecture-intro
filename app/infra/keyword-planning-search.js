import { createAction } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

export default function KeywordPlanningSearchInfra () {
  const dispatch = useDispatch();

  this.searchKeywordPlanning = function (params) {
    const type = '@redux/SEARCH_KEYWORD_PLANNING';
    const key = `keywordPlanning.${encodeURIComponent(params.input)}`;

    // TODO: check should fetch

    async function handler () {
      // return callAPI({

      // })

      const body = { data: [1, 2, 3, 4, 5], pagination: { total: 10, limit: 5, page: 1 } };
      const { data, ...extras } = body;
      return [null, data, extras];
    }

    const PENDING = createAction(type + '_PENDING');
    const FAILED = createAction(type + '_FAILED');
    const SUCCESS = createAction(type + '_SUCCESS');

    return [
      handler,
      () => dispatch(PENDING({ key })),
      (error) => dispatch(FAILED({ key, error })),
      (data, extras) => dispatch(SUCCESS({ key, data, ...extras })),
    ];
  };
}
