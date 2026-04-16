import React, { useEffect, useRef } from 'react';
import { getMovieDetails } from '../api/omdb';

const MovieModal = ({ imdbId, onClose }) => {
  const [details, setDetails] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const modalRef = useRef(null);

  // Fetch full movie details using useEffect
  useEffect(() => {
    if (!imdbId) return;
    setLoading(true);
    setError(null);
    setDetails(null);

    getMovieDetails(imdbId).then(({ movie, error: err }) => {
      if (err) setError(err);
      else setDetails(movie);
      setLoading(false);
    });
  }, [imdbId]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Focus trap
  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  const hasPoster = details?.Poster && details.Poster !== 'N/A';

  const formatRating = (rating) => {
    if (!rating || rating === 'N/A') return null;
    return rating;
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Movie details"
    >
      <div
        className="modal"
        ref={modalRef}
        tabIndex={-1}
        id="movie-detail-modal"
      >
        {/* Close Button */}
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close movie details"
          id="modal-close-btn"
        >
          ✕
        </button>

        {loading && (
          <div className="modal-loading" role="status" aria-live="polite">
            <div className="spinner" aria-hidden="true" />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading details...</p>
          </div>
        )}

        {error && !loading && (
          <div className="state-container">
            <div className="state-icon">⚠️</div>
            <div className="state-title">Couldn't Load Details</div>
            <div className="state-subtitle">{error}</div>
          </div>
        )}

        {details && !loading && (
          <>
            {/* Hero section */}
            <div className="modal-hero" aria-hidden="true">
              {hasPoster ? (
                <img
                  className="modal-backdrop"
                  src={details.Poster}
                  alt={`${details.Title} backdrop`}
                />
              ) : (
                <div className="modal-backdrop-placeholder">🎬</div>
              )}
              <div className="modal-hero-overlay" />

              {/* Floating poster */}
              <div className="modal-poster-float">
                {hasPoster ? (
                  <img src={details.Poster} alt={`${details.Title} poster`} />
                ) : (
                  <div style={{
                    width: '100%', height: '100%',
                    background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2rem', opacity: 0.5
                  }}>🎬</div>
                )}
              </div>
            </div>

            {/* Main info */}
            <div className="modal-body">
              <h2 className="modal-title">{details.Title}</h2>
              {details.Tagline && details.Tagline !== 'N/A' && (
                <div className="modal-tagline">"{details.Tagline}"</div>
              )}

              {/* Quick badges */}
              <div className="modal-badges" role="list" aria-label="Movie information">
                {formatRating(details.imdbRating) && (
                  <div className="modal-badge badge-rating" role="listitem">
                    ⭐ {details.imdbRating} / 10
                  </div>
                )}
                {details.Year && details.Year !== 'N/A' && (
                  <div className="modal-badge badge-year" role="listitem">
                    📅 {details.Year}
                  </div>
                )}
                {details.Runtime && details.Runtime !== 'N/A' && (
                  <div className="modal-badge badge-runtime" role="listitem">
                    ⏱ {details.Runtime}
                  </div>
                )}
                {details.Rated && details.Rated !== 'N/A' && (
                  <div className="modal-badge badge-rated" role="listitem">
                    {details.Rated}
                  </div>
                )}
              </div>

              {/* Plot */}
              {details.Plot && details.Plot !== 'N/A' && (
                <p className="modal-plot">{details.Plot}</p>
              )}
            </div>

            {/* Full Details */}
            <div className="modal-details">
              {/* Genre pills */}
              {details.Genre && details.Genre !== 'N/A' && (
                <div className="modal-genres" role="list" aria-label="Genres">
                  {details.Genre.split(', ').map((g) => (
                    <span key={g} className="genre-pill" role="listitem">{g}</span>
                  ))}
                </div>
              )}

              {/* Detail grid */}
              <div className="modal-detail-grid">
                {details.Director && details.Director !== 'N/A' && (
                  <div className="detail-card">
                    <div className="detail-label">Director</div>
                    <div className="detail-value">{details.Director}</div>
                  </div>
                )}
                {details.Writer && details.Writer !== 'N/A' && (
                  <div className="detail-card">
                    <div className="detail-label">Writer</div>
                    <div className="detail-value">{details.Writer.split(',').slice(0, 2).join(', ')}</div>
                  </div>
                )}
                {details.Actors && details.Actors !== 'N/A' && (
                  <div className="detail-card">
                    <div className="detail-label">Cast</div>
                    <div className="detail-value">{details.Actors}</div>
                  </div>
                )}
                {details.Country && details.Country !== 'N/A' && (
                  <div className="detail-card">
                    <div className="detail-label">Country</div>
                    <div className="detail-value">{details.Country}</div>
                  </div>
                )}
                {details.Language && details.Language !== 'N/A' && (
                  <div className="detail-card">
                    <div className="detail-label">Language</div>
                    <div className="detail-value">{details.Language}</div>
                  </div>
                )}
                {details.BoxOffice && details.BoxOffice !== 'N/A' && (
                  <div className="detail-card">
                    <div className="detail-label">Box Office</div>
                    <div className="detail-value">{details.BoxOffice}</div>
                  </div>
                )}
                {details.Awards && details.Awards !== 'N/A' && (
                  <div className="detail-card" style={{ gridColumn: '1 / -1' }}>
                    <div className="detail-label">🏆 Awards</div>
                    <div className="detail-value">{details.Awards}</div>
                  </div>
                )}
              </div>

              {/* Ratings from different sources */}
              {details.Ratings && details.Ratings.length > 0 && (
                <>
                  <div className="detail-label" style={{ marginBottom: '0.8rem' }}>Ratings</div>
                  <div className="modal-ratings" role="list" aria-label="Movie ratings">
                    {details.Ratings.map((r) => (
                      <div key={r.Source} className="rating-card" role="listitem">
                        <div className="rating-source">
                          {r.Source.replace('Internet Movie Database', 'IMDb').replace('Rotten Tomatoes', 'RT')}
                        </div>
                        <div className="rating-value">{r.Value}</div>
                      </div>
                    ))}
                    {details.Metascore && details.Metascore !== 'N/A' && (
                      <div className="rating-card" role="listitem">
                        <div className="rating-source">Metascore</div>
                        <div className="rating-value">{details.Metascore}</div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MovieModal;
