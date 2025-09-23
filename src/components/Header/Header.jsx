import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import Auth from '../Auth/Auth';
import './Header.css';

const Header = ({ 
  searchTerm, 
  setSearchTerm, 
  searchEngine, 
  setSearchEngine, 
  searchEngines, 
  onSearch,
  user,
  onSignIn,
  onSignOut
}) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="app-title">LinkStart</h1>
        </div>
        <div className="header-center">
          <SearchBar 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchEngine={searchEngine}
            setSearchEngine={setSearchEngine}
            searchEngines={searchEngines}
            onSearch={onSearch}
          />
        </div>
        <div className="header-right">
          <Auth 
            user={user}
            onSignIn={onSignIn}
            onSignOut={onSignOut}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;