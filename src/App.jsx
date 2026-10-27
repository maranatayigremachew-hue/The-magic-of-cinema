import { useState } from 'react';
import Movies from './Movies.jsx';

export default function App() {
  const [searchText, setSearchText] = useState('');
  const [query, setQuery] = useState('');

  function handleSearch(event) {
    event.preventDefault();
    setQuery(searchText.trim());
  }

  return (
    <main className="cinema-page">
      <section className={`search-panel ${query ? 'has-results' : ''}`} aria-label="Movie search">
        <header className="panel-header">
          <div className="heading-copy">
            <h1>Movie Search</h1>
            <p>{query ? 'Live TMDB results' : 'Search for a movie to begin'}</p>
          </div>
          <form className="movie-search-form" onSubmit={handleSearch}>
            <input
              type="search"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search movie"
              aria-label="Search movie"
            />
            <button type="submit" disabled={!searchText.trim()}><span aria-hidden="true">⌕</span> Search movie</button>
          </form>
        </header>
        <Movies query={query} />
      </section>
      <div className="page-credit">A GOOD FILM IS ALWAYS WORTH FINDING</div>
    </main>
  );
}
