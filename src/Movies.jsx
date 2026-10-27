import { useEffect, useState } from 'react';

const imageBase = 'https://image.tmdb.org/t/p/w500';

export default function Movies({ query }) {
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!query) {
      setMovies([]);
      setStatus('idle');
      setError('');
      return undefined;
    }

    const apiKey = import.meta.env.VITE_TMDB_API_KEY?.trim();
    const accessToken = import.meta.env.VITE_TMDB_ACCESS_TOKEN?.trim();
    if (!apiKey && !accessToken) {
      setMovies([]);
      setStatus('error');
      setError('Add your TMDB API key or access token to src/.env, then restart Vite.');
      return undefined;
    }

    const controller = new AbortController();
    setStatus('loading');
    setError('');

    async function searchMovies() {
      try {
        const params = new URLSearchParams({ query, include_adult: 'false', language: 'en-US', page: '1' });
        if (apiKey) params.set('api_key', apiKey);
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?${params}`, {
          signal: controller.signal,
          headers: accessToken ? { Authorization: `Bearer ${accessToken}`, accept: 'application/json' } : { accept: 'application/json' },
        });
        if (!response.ok) throw new Error(response.status === 401 ? `TMDB did not accept the ${accessToken ? 'access token' : 'API key'}. Check your .env value.` : 'Could not load movies. Please try again.');
        const data = await response.json();
        setMovies(data.results ?? []);
        setStatus('success');
      } catch (requestError) {
        if (requestError.name === 'AbortError') return;
        setError(requestError.message || 'Could not load movies. Please try again.');
        setStatus('error');
      }
    }

    searchMovies();
    return () => controller.abort();
  }, [query]);

  if (!query) return <p className="empty-prompt">Try searching for a movie to see results here.</p>;
  if (status === 'loading') return <div className="state-message"><span className="spinner" aria-hidden="true">◌</span> Searching TMDB...</div>;
  if (status === 'error') return <div className="state-message error-message">{error}</div>;
  if (status === 'success' && movies.length === 0) return <div className="state-message">No movies found for “{query}”. Try another title.</div>;

  return (
    <div className="movie-results" aria-live="polite">
      {movies.map((movie) => (
        <article className="movie-result" key={movie.id}>
          <div className="poster-frame">
            {movie.poster_path ? (
              <img src={`${imageBase}${movie.poster_path}`} alt={`${movie.title} poster`} loading="lazy" />
            ) : (
              <div className="poster-placeholder"><span>POSTER<br />UNAVAILABLE</span></div>
            )}
          </div>
          <h2>{movie.title}</h2>
          {movie.release_date && <p className="release-year">{movie.release_date.slice(0, 4)}{movie.vote_average ? <><span> · </span>★ {movie.vote_average.toFixed(1)}</> : null}</p>}
          <p className="overview">{movie.overview || 'No description is available for this movie yet.'}</p>
        </article>
      ))}
    </div>
  );
}
