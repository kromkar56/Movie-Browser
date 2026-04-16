import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import MovieGrid from './components/MovieGrid';
import MovieModal from './components/MovieModal';
import { searchMovies, getPopularMovies } from './api/omdb';

// Genre / mood presets that drive quick search
const GENRE_PRESETS = [
  { label: '🔥 Trending', query: 'Marvel' },
  { label: '🎬 Action', query: 'Action' },
  { label: '😂 Comedy', query: 'Comedy' },
  { label: '😱 Horror', query: 'Horror' },
  { label: '💡 Sci-Fi', query: 'Science Fiction' },
  { label: '💔 Drama', query: 'Drama' },
  { label: '🕵️ Thriller', query: 'Thriller' },
  { label: '✨ Animated', query: 'Pixar' },
];

const QUICK_SEARCHES = ['Avengers', 'Inception', 'The Dark Knight', 'Interstellar', 'Parasite'];

function App() {
  // ─── State ───────────────────────────────────────────────
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState('');
  const [currentQuery, setCurrentQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeGenre, setActiveGenre] = useState(null);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // ─── Fetch movies (useEffect for initial popular load) ───
  useEffect(() => {
    // Load default "popular" results on mount
    getPopularMovies('Marvel').then(({ results, totalResults: total, error: err }) => {
      if (!err) {
        setMovies(results);
        setTotalResults(total);
        setCurrentQuery('Marvel');
      }
      setLoading(false);
    });
  }, []);

  // ─── Search handler (useState for results) ───────────────
  const handleSearch = useCallback(async (searchQuery) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    setQuery(trimmed);
    setCurrentQuery(trimmed);
    setLoading(true);
    setError(null);
    setMovies([]);
    setPage(1);
    setHasSearched(true);
    setActiveGenre(null);

    const { results, totalResults: total, error: err } = await searchMovies(trimmed, 1);

    if (err) {
      setError(err);
      setMovies([]);
      setTotalResults(0);
    } else {
      setMovies(results);
      setTotalResults(total);
    }
    setLoading(false);
  }, []);

  // ─── Genre preset click ───────────────────────────────────
  const handleGenreClick = useCallback((preset) => {
    setActiveGenre(preset.label);
    handleSearch(preset.query);
  }, [handleSearch]);

  // ─── Load more (pagination) ───────────────────────────────
  const handleLoadMore = useCallback(async () => {
    const nextPage = page + 1;
    setLoadingMore(true);
    const { results, error: err } = await searchMovies(currentQuery, nextPage);
    if (!err) {
      setMovies((prev) => {
        // Deduplicate by imdbID
        const ids = new Set(prev.map((m) => m.imdbID));
        return [...prev, ...results.filter((m) => !ids.has(m.imdbID))];
      });
      setPage(nextPage);
    }
    setLoadingMore(false);
  }, [page, currentQuery]);

  // ─── Movie card click → open modal ───────────────────────
  const handleMovieClick = useCallback((imdbId) => {
    setSelectedMovieId(imdbId);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMovieId(null);
  }, []);

  // ─── Derived state ────────────────────────────────────────
  const hasMore = movies.length < totalResults;
  const showGrid = movies.length > 0;
  const showEmpty = !loading && hasSearched && movies.length === 0 && !error;

  return (
    <div className="app">
      {/* Navigation */}
      <Navbar
        searchComponent={
          <SearchBar
            onSearch={handleSearch}
            initialQuery={query}
            compact
          />
        }
      />

      {/* Hero Section */}
      <section className="hero" aria-label="CineVault hero">
        <div className="hero-bg" aria-hidden="true">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
        </div>

        <div className="hero-content">
          <h1 className="hero-heading">
            Your Ultimate <span>Movie</span> Universe
          </h1>
          <p className="hero-subtext">
            Search over 1 million movies, TV shows &amp; episodes.<br />
            Get ratings, cast, awards, and more — all in one place.
          </p>

        </div>
      </section>

      {/* Main Content */}
      <main className="main-content" id="main-content">
        {/* Genre Filter Tabs */}
        <div className="genre-section">
          <div className="section-label">Browse by Genre</div>
          <div className="genre-tabs" role="tablist" aria-label="Movie genres">
            {GENRE_PRESETS.map((preset) => (
              <button
                key={preset.label}
                id={`genre-tab-${preset.label.replace(/\s+/g, '-').toLowerCase()}`}
                className={`genre-tab ${activeGenre === preset.label ? 'active' : ''}`}
                onClick={() => handleGenreClick(preset)}
                role="tab"
                aria-selected={activeGenre === preset.label}
                aria-label={`Browse ${preset.label} movies`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Header */}
        {showGrid && !loading && (
          <div className="results-header">
            <h2 className="results-title">
              {hasSearched ? `Results for "${currentQuery}"` : `🔥 Popular Now`}
            </h2>
            <span className="results-count">{totalResults.toLocaleString()} titles</span>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="state-container" role="alert">
            <div className="state-icon">😞</div>
            <div className="state-title">No Results Found</div>
            <div className="state-subtitle">
              {error === 'Movie not found!' || error === 'Too many results.'
                ? `We couldn't find anything for "${currentQuery}". Try a different keyword.`
                : `Something went wrong: ${error}`}
            </div>
            <div className="state-tags" aria-label="Quick search suggestions">
              {QUICK_SEARCHES.map((s) => (
                <button
                  key={s}
                  className="state-tag"
                  onClick={() => handleSearch(s)}
                  aria-label={`Search for ${s}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty state (after search with no results) */}
        {showEmpty && (
          <div className="state-container" role="status">
            <div className="state-icon">🎬</div>
            <div className="state-title">Nothing Here Yet</div>
            <div className="state-subtitle">
              Try searching for a movie title, genre, or actor name.
            </div>
            <div className="state-tags">
              {QUICK_SEARCHES.map((s) => (
                <button key={s} className="state-tag" onClick={() => handleSearch(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Welcome state — before any search */}
        {!hasSearched && !loading && movies.length === 0 && !error && (
          <div className="state-container" role="region" aria-label="Welcome">
            <div className="state-icon">🎥</div>
            <div className="state-title">Discover Your Next Favorite Film</div>
            <div className="state-subtitle">
              Type a movie name in the search bar above to get started.
            </div>
            <div className="state-tags">
              {QUICK_SEARCHES.map((s) => (
                <button key={s} className="state-tag" onClick={() => handleSearch(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Movie Grid */}
        <MovieGrid
          movies={movies}
          loading={loading}
          onMovieClick={handleMovieClick}
        />

        {/* Load More Button */}
        {showGrid && hasMore && !loading && (
          <div className="load-more-wrapper">
            <button
              id="load-more-btn"
              className="load-more-btn"
              onClick={handleLoadMore}
              disabled={loadingMore}
              aria-label="Load more movies"
            >
              {loadingMore ? (
                <>
                  <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                  Loading...
                </>
              ) : (
                <>
                  <span>↓</span>
                  Load More Movies
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    ({totalResults - movies.length} remaining)
                  </span>
                </>
              )}
            </button>
          </div>
        )}
      </main>

      

      {/* Movie Detail Modal */}
      {selectedMovieId && (
        <MovieModal
          imdbId={selectedMovieId}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default App;
