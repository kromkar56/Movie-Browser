import React from 'react';

const Navbar = ({ searchComponent }) => {
  return (
    <header className="navbar" role="banner">
      {/* Brand */}
      <a className="navbar-brand" href="/" aria-label="CineVault Home">
        <div className="navbar-logo-icon" aria-hidden="true">🎬</div>
        <div>
          <div className="navbar-title">CineVault</div>
          <div className="navbar-subtitle">Discover Cinema</div>
        </div>
      </a>

      {/* Inline search in navbar on larger screens */}
      {searchComponent && (
        <div className="navbar-center" aria-label="Search bar">
          {searchComponent}
        </div>
      )}

      {/* Stats */}
      <div className="navbar-right" aria-label="Site statistics">
        <div className="navbar-stat">
          <span className="navbar-stat-num">1M+</span>
          <span className="navbar-stat-label">Movies</span>
        </div>
        <div className="navbar-stat">
          <span className="navbar-stat-num">IMDb</span>
          <span className="navbar-stat-label">Powered</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
