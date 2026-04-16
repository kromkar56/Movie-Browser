import React from 'react';

const MovieCard = ({ movie, onClick }) => {
  const hasPoster = movie.Poster && movie.Poster !== 'N/A';
  const typeLabel = movie.Type === 'movie' ? 'Film' : movie.Type === 'series' ? 'Series' : movie.Type;

  return (
    <article
      className="movie-card"
      onClick={() => onClick(movie.imdbID)}
      role="button"
      tabIndex={0}
      aria-label={`${movie.Title}, ${movie.Year}. Click for details.`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(movie.imdbID); }}
    >
      {/* Poster */}
      <div className="movie-card-poster">
        {hasPoster ? (
          <img
            src={movie.Poster}
            alt={`${movie.Title} poster`}
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className="poster-placeholder"
          style={{ display: hasPoster ? 'none' : 'flex' }}
          aria-hidden="true"
        >
          <span className="poster-placeholder-icon">🎬</span>
          <span className="poster-placeholder-text">{movie.Title}</span>
        </div>

        {/* Overlay with CTA */}
        <div className="movie-card-overlay" aria-hidden="true">
          <button className="overlay-btn" tabIndex={-1}>
            <span>ℹ️</span> View Details
          </button>
        </div>

        {/* Type badge */}
        {movie.Type && (
          <span className="type-badge" aria-label={`Type: ${typeLabel}`}>
            {typeLabel}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="movie-card-info">
        <h3 className="movie-card-title">{movie.Title}</h3>
        <div className="movie-card-meta">
          {movie.Year && <span className="movie-card-year">{movie.Year}</span>}
        </div>
      </div>
    </article>
  );
};

export default MovieCard;
