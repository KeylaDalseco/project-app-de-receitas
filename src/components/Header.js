import { useContext } from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import context from '../context/Context';
import '../style/Header.css';

function Header() {
  const { headerState, setNotSearch, notSearch } = useContext(context);

  const handlerClick = () => {
    setNotSearch(!notSearch);
  };
  return (
    <header className="header">
      <Link to="/profile">
        <img src={ headerState.profile } alt="Profile" data-testid="profile-top-btn" />
      </Link>
      <h1 data-testid="page-title">{headerState.title}</h1>
      {headerState.renderHeader && (
        <button onClick={ handlerClick } className="search">
          <img src={ headerState.search } alt="Search" data-testid="search-top-btn" />
        </button>
      )}
    </header>
  );
}

export default Header;
