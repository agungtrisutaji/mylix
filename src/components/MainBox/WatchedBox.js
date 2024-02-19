import BoxMovies from './BoxMovies';
import MovieDetails from './WatchedBox/MovieDetail';
import MovieWatched from './WatchedBox/MovieWatched';
import WatchedSummary from './WatchedBox/WatchedSummary';

export default function WatchedBox({
  apiKey,
  selectedMovie,
  closeMovieHandler,
  addWatchedHandler,
  watched,
  deleteWatchedHandler,
}) {
  return (
    <BoxMovies>
      {selectedMovie ? (
        <MovieDetails
          apiKey={apiKey}
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
  );
}
