import KeywordPlanningSearchInfra from 'infra/keyword-planning-search';

export default function KeywordPlanningSearchUseCase () {
  const infra = new KeywordPlanningSearchInfra();

  this.onSearch = async function (input) {
    const [handler, PENDING, FAILED, SUCCESS] = infra.searchKeywordPlanning({ input });

    PENDING();
    const [error, data, extras] = await handler();
    error ? FAILED(error) : SUCCESS(data, extras);

    return { data, ...extras };
  };
}
