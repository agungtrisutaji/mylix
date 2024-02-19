import Logo from './Navbar/Logo';
import NumResults from './Navbar/Result';
import Search from './Navbar/Search';

export default function NavBar({ search, setSearch, movies }) {
  return (
    <nav className='nav-bar'>
      <Logo />
      <Search search={search} setSearch={setSearch} />
      <NumResults movies={movies} />
    </nav>
  );
}
