import React from 'infra/renderer';
import KeywordPlanningSearchBox from 'presentations/partials/keyword-planning-search-box';
import Repo from 'repo';
import Usecase from 'usecase';

export default function HomePage () {
  const repo = new Repo();
  const usecase = new Usecase(repo);

  return (
    <div className="home-page">
      <div className="title">Keyword Planning</div>
      <KeywordPlanningSearchBox usecase={usecase} />
    </div>
  );
}
