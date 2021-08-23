import Storage from 'infra/storage';
import Entity from 'entity';
import KeywordPlanningRepo from './keyword-planning';

export default function Repo () {
  const entity = new Entity();
  const storage = new Storage();

  const keywordPlanning = new KeywordPlanningRepo(entity, storage);

  this.KeywordPlanning = () => keywordPlanning;
}
