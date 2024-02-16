import { useEffect, useState } from 'react';

const tempWatchedData = [
  {
    imdbID: 'tt15398776',
    Title: 'Oppenheimer',
    Year: '2013',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_SX300.jpg',
    runtime: 180,
    imdbRating: 8.6,
    userRating: 10,
  },
  {
    imdbID: 'tt1517268',
    Title: 'Barbie',
    Year: '2023',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BNjU3N2QxNzYtMjk1NC00MTc4LTk1NTQtMmUxNTljM2I0NDA5XkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_SX300.jpg',
    runtime: 114,
    imdbRating: 7.2,
    userRating: 8,
  },
];

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
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedItem({ movie }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
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
      </div>
    </li>
  );
}

function MovieDetails({ selectedId, onCloseMovie }) {
  const [movie, setMovie] = useState({});

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Plot: plot,
    imdbRating,
    Runtime: runtime,
    Genre: genre,
    Actors: actors,
    Director: director,
  } = movie;

  console.log(title, year, poster, plot, imdbRating, runtime, genre, actors);

  useEffect(() => {
    async function getMovieDetails() {
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${API_KEY}&i=${selectedId}`
      );
      const data = await res.json();
      setMovie(data);
    }
    getMovieDetails();
  }, [selectedId]);

  return (
    <div className='details'>
      <button className='btn-back' onClick={onCloseMovie}>
        X
      </button>
      {selectedId}
    </div>
  );
}

function MovieWatched({ watched }) {
  return (
    <ul className='list'>
      {watched.map((movie, index) => (
        <WatchedItem key={index} movie={movie} />
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
  const [watched, setWatched] = useState(tempWatchedData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);

  function selectedMovieHandler(id) {
    setSelectedMovie((selectedId) => (selectedId === id ? null : id));
  }

  function closeMovieHandler() {
    setSelectedMovie(null);
  }

  useEffect(() => {
    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError('');
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${API_KEY}&s=${search}`
        );

        if (!res.ok) throw new Error('Something went wrong');

        const data = await res.json();

        if (data.Response === 'False') throw new Error(data.Error);

        if (data.Error) {
          throw new Error(data.Error);
        }

        setMovies(data.Search);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMovies();
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
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <MovieWatched watched={watched} />
            </>
          )}
        </BoxMovies>
      </Main>
    </>
  );
}
