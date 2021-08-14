import { useDispatch } from 'react-redux';
import KeywordPlanningSearchInfra from 'infra/keyword-planning-search';

export default function KeywordPlanningSearchUseCase () {
  const infra = new KeywordPlanningSearchInfra();
  const dispatch = useDispatch();

  this.onSearch = function (input) {
    function handleSearch (params) {
      return async (dispatch) => {
        const [handler, PENDING, FAILED, SUCCESS] = infra.searchKeywordPlanning({ dispatch, params });

        PENDING();
        const [error, data, extra] = await handler();
        error ? FAILED(error) : SUCCESS(data, extra);
      };
    }
    dispatch(handleSearch({ input }));
  };
}
