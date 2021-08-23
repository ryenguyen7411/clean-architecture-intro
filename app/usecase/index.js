import KeywordPlanningUsecase from './keyword-planning';

export default function Usecase (repo) {
  const keywordPlanning = new KeywordPlanningUsecase(repo);

  this.KeywordPlanning = () => keywordPlanning;
}
