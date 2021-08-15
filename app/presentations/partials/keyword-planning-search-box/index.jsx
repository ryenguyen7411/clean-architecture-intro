import React, { useState } from 'infra/renderer';
import KeywordPlanningUseCase from 'usecase/keyword-planning';

export default function KeywordPlanningSearchBox () {
  const usecase = new KeywordPlanningUseCase();
  const [input, setInput] = useState('');

  function handleSearch () {
    usecase.onSearch(input);
  }

  return (
    <div className="keyword-planning-search-box">
      SEARCH BOX
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleSearch}>SEARCH</button>
    </div>
  );
}
