import MovieItem from './MovieResult/MovieItem';

export default function MovieResult({ movies, onSelectedMovie }) {
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
