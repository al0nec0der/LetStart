import { useState, useMemo } from 'react';

export const useSearch = (items) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchEngine, setSearchEngine] = useState('google');

  const searchEngines = {
    google: 'https://www.google.com/search?q=',
    duckduckgo: 'https://duckduckgo.com/?q=',
    bing: 'https://www.bing.com/search?q=',
    brave: 'https://search.brave.com/search?q='
  };

  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    
    const term = searchTerm.toLowerCase();
    return items.filter(item => {
      // Search in category titles
      if (item.title && item.title.toLowerCase().includes(term)) {
        return true;
      }
      
      // Search in link names and URLs
      if (item.links && Array.isArray(item.links)) {
        return item.links.some(link => 
          (link.name && link.name.toLowerCase().includes(term)) ||
          (link.url && link.url.toLowerCase().includes(term))
        );
      }
      
      return false;
    });
  }, [items, searchTerm]);

  const performSearch = () => {
    if (!searchTerm) return;
    const searchUrl = searchEngines[searchEngine] + encodeURIComponent(searchTerm);
    window.open(searchUrl, '_blank');
  };

  return {
    searchTerm,
    setSearchTerm,
    searchEngine,
    setSearchEngine,
    searchEngines,
    filteredItems,
    performSearch
  };
};