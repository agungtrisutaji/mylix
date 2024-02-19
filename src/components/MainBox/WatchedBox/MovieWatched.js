import WatchedItem from './MovieWatched/WatchedItem';

export default function MovieWatched({ watched, onDelete }) {
  return (
    <ul className='list'>
      {watched.map((movie, index) => (
        <WatchedItem key={index} movie={movie} onDelete={onDelete} />
      ))}
    </ul>
  );
}
