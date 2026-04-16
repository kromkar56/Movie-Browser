import React, { useState, useRef, useEffect } from 'react';

const SUGGESTIONS = [
  'Avengers', 'Inception', 'Interstellar', 'The Dark Knight',
  'Parasite', 'Pulp Fiction', 'Forrest Gump', 'The Matrix',
];

const SearchBar = ({ onSearch, initialQuery = '', compact = false }) => {
  const [query, setQuery] = useState(initialQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  // Hide suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      onSearch(trimmed);
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const filteredSuggestions = query.length >= 2
    ? SUGGESTIONS.filter(s => s.toLowerCase().includes(query.toLowerCase()))
    : SUGGESTIONS.slice(0, 5);

  return (
    <div className="search-wrapper" ref={wrapperRef}>
      <form onSubmit={handleSubmit} role="search" aria-label="Search movies">
        <div className="search-container">
          <span className="search-icon" aria-hidden="true">🔍</span>
          <input
            id="movie-search-input"
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder={compact ? 'Search movies...' : 'Search for movies, TV series, or episodes...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            autoComplete="off"
            aria-label="Movie search"
            aria-autocomplete="list"
          />
          {query && (
            <button
              type="button"
              className="search-clear"
              onClick={() => { setQuery(''); inputRef.current?.focus(); }}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
          {!compact && (
            <button
              id="search-submit-btn"
              type="submit"
              className="search-btn"
              disabled={!query.trim()}
              aria-label="Submit search"
            >
              <span>Search</span>
              <span aria-hidden="true">→</span>
            </button>
          )}
        </div>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div
          className="search-suggestions"
          role="listbox"
          aria-label="Search suggestions"
        >
          {filteredSuggestions.map((suggestion) => (
            <div
              key={suggestion}
              className="suggestion-item"
              role="option"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <span className="suggestion-icon" aria-hidden="true">📽️</span>
              <span className="suggestion-text">{suggestion}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
