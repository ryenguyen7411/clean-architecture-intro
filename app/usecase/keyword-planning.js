import KeywordPlanningRepo from 'infra/keyword-planning';

export default function KeywordPlanningUseCase () {
  const repo = new KeywordPlanningRepo();

  this.onSearch = async function (input) {
    const [handler, PENDING, FAILED, SUCCESS] = repo.searchKeywordPlanning({ input });

    PENDING();
    const [error, data, extras] = await handler();
    error ? FAILED(error) : SUCCESS(data, extras);

    return { data, ...extras };
  };
}
