import React, { useState } from 'react';
import KeywordPlanningSearchUseCase from 'usecase/keyword-planning-search';

export default function KeywordPlanningSearchBox () {
  const usecase = new KeywordPlanningSearchUseCase();
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
