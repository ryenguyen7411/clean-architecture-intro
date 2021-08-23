import KeywordPlanningStorage from './keyword-planning';

export default function Storage () {
  const keywordPlanning = new KeywordPlanningStorage();

  this.KeywordPlanning = () => keywordPlanning;
}

export * from './configure';
