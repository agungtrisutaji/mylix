import BoxMovies from './BoxMovies';
import ErrorMessage from './ErrorMessage';
import MovieResult from './ResultBox/MovieResult';
import Loader from './ResultBox/MovieResult/Loader';

export default function ResultBox({
  movies,
  isLoading,
  error,
  selectedMovieHandler,
}) {
  return (
    <BoxMovies>
      {isLoading && <Loader />}
      {!isLoading && !error && (
        <MovieResult movies={movies} onSelectedMovie={selectedMovieHandler} />
      )}
      {error && <ErrorMessage message={error} />}
    </BoxMovies>
  );
}
