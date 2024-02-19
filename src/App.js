import { useEffect, useState } from 'react';
import NavBar from './components/Navbar';
import ResultBox from './components/MainBox/ResultBox';
import MainBox from './components/MainBox';
import WatchedBox from './components/MainBox/WatchedBox';

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);

  const API_KEY = '72ef0764';

  useEffect(() => {
    const storedWatched = localStorage.getItem('watched');
    if (storedWatched) {
      setWatched(JSON.parse(storedWatched));
    }

    const storedUserRating = localStorage.getItem('userRating');
    if (storedUserRating) {
      setUserRating(Number(storedUserRating));
    }
  }, []);

  function selectedMovieHandler(id) {
    setSelectedMovie((selectedId) => (selectedId === id ? null : id));
  }

  function addWatchedHandler(movie) {
    setWatched((prevWatched) => {
      const newWatched = [...prevWatched, movie];
      localStorage.setItem('watched', JSON.stringify(newWatched));
      return newWatched;
    });
  }

  function deleteWatchedHandler(id) {
    setWatched((prevWatched) => {
      const newWatched = prevWatched.filter((movie) => movie.imdbID !== id);
      localStorage.setItem('watched', JSON.stringify(newWatched));
      return newWatched;
    });
  }

  function setUserRating(rating) {
    setUserRating(rating);
    localStorage.setItem('userRating', rating.toString());
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
      <NavBar search={search} setSearch={setSearch} movies={movies} />
      <MainBox>
        <ResultBox
          movies={movies}
          isLoading={isLoading}
          selectedMovieHandler={selectedMovieHandler}
          error={error}
        />

        <WatchedBox
          apiKey={API_KEY}
          selectedMovie={selectedMovie}
          closeMovieHandler={closeMovieHandler}
          addWatchedHandler={addWatchedHandler}
          watched={watched}
          deleteWatchedHandler={deleteWatchedHandler}
        />
      </MainBox>
    </>
  );
}
