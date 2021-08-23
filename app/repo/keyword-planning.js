import { useDispatch } from 'react-redux';

export default function KeywordPlanningRepo (entity, storage) {
  const dispatch = useDispatch();

  this.searchKeywordPlanning = async function (input) {
    const [SUCCESS, PENDING, FAILED] = storage.KeywordPlanning().search.actions;

    const key = encodeURIComponent(input);

    // TODO: check should fetch

    dispatch(PENDING({ key }));

    // return callAPI({

    // })

    const body = { data: [{ input }], pagination: { total: 10, limit: 5, page: 1 } };
    const { data, ...extras } = body;

    dispatch(SUCCESS({ key, data, ...extras }));

    return [null, data, extras];
  };

  this.getKeywordPlanning = function (input) {
    return storage.KeywordPlanning().getKeywordPlanning(input);
  };

  this.getCurrentSearchKeyword = function () {
    return storage.KeywordPlanning().getCurrentSearchKeyword();
  };
}
