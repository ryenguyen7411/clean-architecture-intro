import { useDispatch } from 'react-redux';
import KeywordPlanningSearchInfra from 'infra/keyword-planning-search';

export default function KeywordPlanningSearchUseCase () {
  const infra = new KeywordPlanningSearchInfra();
  const dispatch = useDispatch();

  this.onSearch = function (input) {
    function handleSearch (params) {
      return async (dispatch) => {
        dispatch(infra.KeywordPlanningSearch.PENDING());
        const [error, data] = await infra.searchKeywordPlanning(params);

        if (error) dispatch(infra.KeywordPlanningSearch.FAILED(error));
        else dispatch(infra.KeywordPlanningSearch.SUCCESS(data));
      };
    }
    dispatch(handleSearch({ input }));
  };
}
