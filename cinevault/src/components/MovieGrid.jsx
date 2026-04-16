import React from 'react';
import MovieCard from './MovieCard';

const SkeletonCard = () => (
  <div className="skeleton-card" aria-hidden="true">
    <div className="skeleton skeleton-poster" />
    <div className="skeleton-info">
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-meta" />
    </div>
  </div>
);

const MovieGrid = ({ movies, loading, onMovieClick }) => {
  if (loading) {
    return (
      <section aria-label="Loading movies" aria-live="polite">
        <div className="movies-grid">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (!movies || movies.length === 0) return null;

  return (
    <section aria-label={`${movies.length} movies found`}>
      <div className="movies-grid" role="list">
        {movies.map((movie) => (
          <div key={movie.imdbID} role="listitem">
            <MovieCard movie={movie} onClick={onMovieClick} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default MovieGrid;
