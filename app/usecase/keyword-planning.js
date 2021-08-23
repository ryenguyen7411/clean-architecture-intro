export default function KeywordPlanningUseCase (repo) {
  this.validateInput = function (input) {
    if (!input) return [new Error('input is required.')];
    if (input.length < 5) return [new Error('input shold have minimum 5 characters.')];
    return [null];
  };

  this.onSearch = async function (input) {
    let err, data, extras;

    [err] = this.validateInput(input);
    if (err) return [err];

    [err, data, extras] = await repo.KeywordPlanning().searchKeywordPlanning(input);
    return [err, data, extras];
  };

  this.useDataListener = function (input) {
    const data = repo.KeywordPlanning().getKeywordPlanning(input);
    if (!data) this.onSearch(input);
    return data;
  };

  this.useCurrentSearchKeyword = function () {
    const currentKeyword = repo.KeywordPlanning().getCurrentSearchKeyword();
    return currentKeyword || '';
  };
}
