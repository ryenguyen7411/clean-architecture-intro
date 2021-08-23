import React, { useEffect, useState } from 'infra/renderer';

export default function KeywordPlanningSearchBox ({ usecase }) {
  const currentSearchKeyword = usecase.KeywordPlanning().useCurrentSearchKeyword();

  const searchData = usecase.KeywordPlanning().useDataListener(currentSearchKeyword);
  const [input, setInput] = useState('');
  const [error, setError] = useState();

  async function handleSearch () {
    const [err] = await usecase.KeywordPlanning().onSearch(input);
    if (err) return setError(err.toString());
  }

  useEffect(() => {
    if (currentSearchKeyword !== input) setInput(currentSearchKeyword);
  }, [currentSearchKeyword]);

  return (
    <div className="keyword-planning-search-box">
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleSearch}>SEARCH</button>

      {error && <div className="text-red">{error}</div>}
      <div>SEARCH DATA: {JSON.stringify(searchData)}</div>
    </div>
  );
}
