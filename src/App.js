import { useEffect, useState } from 'react';
import StarRating from './components/StarRating';

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function Logo() {
  return (
    <div className='logo'>
      <span role='img'>🎫</span>
      <h1>MyLix</h1>
    </div>
  );
}

function Search({ search, setSearch }) {
  return (
    <input
      className='search'
      type='text'
      placeholder='Search movies...'
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}

function NumResults({ movies }) {
  return (
    <p className='num-results'>
      Found <strong>{movies?.length}</strong> results
    </p>
  );
}

function MovieItem({ movie, onSelectedMovie }) {
  return (
    <li key={movie.imdbID} onClick={() => onSelectedMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>📅</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieList({ movies, onSelectedMovie }) {
  return (
    <ul className='list list-movies'>
      {movies?.map((movie, index) => (
        <MovieItem
          key={index}
          movie={movie}
          onSelectedMovie={onSelectedMovie}
        />
      ))}
    </ul>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className='summary'>
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>🎬</span>
          <span>{avgImdbRating.toFixed(1)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{Math.trunc(avgRuntime)} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedItem({ movie, onDelete }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>🎬</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button className='btn-delete' onClick={() => onDelete(movie.imdbID)}>
          x
        </button>
      </div>
    </li>
  );
}

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const isWatched = watched.some((movie) => movie.imdbID === selectedId);

  const userRatingWatched = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Released: released,
    Poster: poster,
    imdbRating,
    Runtime: runtime,
    Plot: plot,
    Genre: genre,
    Actors: actors,
    Director: director,
  } = movie;

  function addWatchedHandler() {
    const newWatched = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(' ').at(0)),
      userRating: Number(userRating),
    };
    onAddWatched(newWatched);
    onCloseMovie();
  }

  useEffect(() => {
    async function getMovieDetails() {
      setIsLoading(true);
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&i=${selectedId}`
      );
      const data = await response.json();
      setMovie(data);
      setIsLoading(false);
    }
    getMovieDetails();
  }, [selectedId]);

  useEffect(() => {
    if (!title) return;
    document.title = `Mylix | ${title}` || 'Mylix';
    return () => {
      document.title = 'Mylix';
    };
  }, [title]);

  return (
    <div className='details'>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className='btn-back' onClick={onCloseMovie}>
              &#x2715;
            </button>
            <img src={poster} alt={`${title} poster`} />
            <div className='details-overview'>
              <h2>{title}</h2>
              <p>
                <span>📅</span>
                <span>{released}</span>
              </p>
              <p>
                <span>⏳</span>
                <span>{runtime}</span>
              </p>
              <p>
                <span>🌟</span>
                <span>{imdbRating}</span>
              </p>
            </div>
          </header>
          <section>
            <p>
              <em>{plot}</em>
            </p>
            <p>Genre: {genre}</p>
            <p>Starring: {actors}</p>
            <p>Directed by: {director}</p>
            <div className='rating'>
              {!isWatched ? (
                <>
                  <StarRating
                    max={10}
                    size={24}
                    color='#fcc419'
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className='btn-add' onClick={addWatchedHandler}>
                      Add to Watched
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You Have Watched This Movie, <br /> Your Rating:{' '}
                  <span>🌟</span>
                  <span>{userRatingWatched} / 10</span>
                </p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function MovieWatched({ watched, onDelete }) {
  return (
    <ul className='list'>
      {watched.map((movie, index) => (
        <WatchedItem key={index} movie={movie} onDelete={onDelete} />
      ))}
    </ul>
  );
}

function NavBar({ children }) {
  return <nav className='nav-bar'>{children}</nav>;
}

function Main({ children }) {
  return <main className='main'>{children}</main>;
}

function BoxMovies({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className='box'>
      <button className='btn-toggle' onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? '–' : '+'}
      </button>
      {isOpen && children}
    </div>
  );
}

function Loader() {
  return (
    <div className='loader'>
      <div className='loading-bar'>
        <div className='bar'></div>
      </div>
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <div className='error'>
      <span>⛔</span> {message}
    </div>
  );
}

const API_KEY = '72ef0764';

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [watchedMovie, setWatchedMovie] = useState(null);

  function selectedMovieHandler(id) {
    setSelectedMovie((selectedId) => (selectedId === id ? null : id));
  }

  function addWatchedHandler(movie) {
    setWatched((prevWatched) => [...prevWatched, movie]);
  }

  function deleteWatchedHandler(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  function closeMovieHandler() {
    setSelectedMovie(null);
  }

  useEffect(() => {
    if (!search) return;

    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError('');
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${API_KEY}&s=${search}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error('Something went wrong');

        const data = await res.json();

        if (data.Response === 'False') throw new Error(data.Error);

        if (data.Error) {
          throw new Error(data.Error);
        }

        setMovies(data.Search);
        setError('');
        setIsLoading(false);
      } catch (err) {
        if (err.name !== 'AbortError') return;
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMovies();
    return () => {
      controller.abort();
    };
  }, [search]);

  return (
    <>
      <NavBar>
        <Logo />
        <Search search={search} setSearch={setSearch} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <BoxMovies>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectedMovie={selectedMovieHandler} />
          )}
          {error && <ErrorMessage message={error} />}
        </BoxMovies>

        <BoxMovies>
          {selectedMovie ? (
            <MovieDetails
              selectedId={selectedMovie}
              onCloseMovie={closeMovieHandler}
              onAddWatched={addWatchedHandler}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <MovieWatched watched={watched} onDelete={deleteWatchedHandler} />
            </>
          )}
        </BoxMovies>
      </Main>
    </>
  );
}
