import Search from "./Search";
import Logo from "./Logo";
import NumResults from "./NumResults";

export default function Navbar({ movies }) {
  return (
    <nav className="nav-bar">
      <Logo />
      <NumResults movies={movies} />
      <Search />
    </nav>
  );
}
