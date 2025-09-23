import React, { useState } from 'react';
import { FaSearch, FaCaretDown } from 'react-icons/fa';
import Button from '../Button/Button';
import './SearchBar.css';

const SearchBar = ({ 
  searchTerm, 
  setSearchTerm, 
  searchEngine, 
  setSearchEngine, 
  searchEngines, 
  onSearch 
}) => {
  const [showEngines, setShowEngines] = useState(false);

  const handleEngineSelect = (engine) => {
    setSearchEngine(engine);
    setShowEngines(false);
  };

  const currentEngineName = Object.keys(searchEngines).find(
    key => searchEngines[key] === searchEngines[searchEngine]
  ) || 'Google';

  return (
    <div className="search-container">
      <div className="search-input-container">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search links or the web..."
          className="search-input"
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        />
        <Button 
          variant="icon-only" 
          onClick={() => setShowEngines(!showEngines)}
          className="engine-selector"
        >
          <span className="engine-name">{currentEngineName}</span>
          <FaCaretDown />
        </Button>
        <Button 
          variant="primary" 
          onClick={onSearch}
          icon={<FaSearch />}
          className="search-button"
        />
      </div>
      
      {showEngines && (
        <div className="engine-dropdown">
          {Object.entries(searchEngines).map(([key, url]) => (
            <button
              key={key}
              className={`engine-option ${searchEngine === key ? 'active' : ''}`}
              onClick={() => handleEngineSelect(key)}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;