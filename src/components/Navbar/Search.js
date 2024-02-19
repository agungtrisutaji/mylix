export default function Search({ search, setSearch }) {
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
