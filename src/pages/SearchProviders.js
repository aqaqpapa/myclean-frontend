import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchProviders() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const mockProviders = [
    { id: 1, name: 'Sparkle Cleaners', rating: 4.5 },
    { id: 2, name: 'Fresh Home Service', rating: 4.2 },
    { id: 3, name: 'Shiny & Bright', rating: 4.8 },
  ];

  const handleSearch = () => {
    // 简单模拟搜索
    const filtered = mockProviders.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  };

  const handleViewDetails = (provider) => {
    alert(`查看服务商详情：${provider.name}（后续开发）`);
  };

  return (
    <div className="App" style={{ padding: '20px' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>Back</button>
      <h2>Search Nearby Cleaning Services</h2>
      <input
        type="text"
        placeholder="Enter location or service"
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{ width: '300px', marginRight: '10px' }}
      />
      <button onClick={handleSearch}>Search</button>

      <ul style={{ marginTop: '20px' }}>
        {results.map(p => (
          <li key={p.id} style={{ marginBottom: '10px', cursor: 'pointer' }} onClick={() => handleViewDetails(p)}>
            {p.name} - Rating: {p.rating}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchProviders;
