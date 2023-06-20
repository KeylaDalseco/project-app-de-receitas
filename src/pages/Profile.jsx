import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import Footer from '../components/Footer';
import context from '../context/Context';
import userIcon from '../images/user.png';
import '../style/Profile.css';

export default function Profile(props) {
  const { history } = props;
  const { headerState, setHeaderState } = useContext(context);
  const email = JSON.parse(localStorage.getItem('user')) || '';
  useEffect(() => {
    const updateState = () => {
      setHeaderState({ ...headerState,
        title: 'Profile',
        renderHeader: false });
    };
    updateState();
  }, []);

  const logout = () => {
    localStorage.clear();
    history.push('/');
  };

  return (
    <div className="profile">
      <Header />
      <img className="icon" src={ userIcon } alt="Icon Profile" />
      <h3 data-testid="profile-email">{email.email}</h3>

      <button
        type="button"
        data-testid="profile-done-btn"
        onClick={ () => history.push('/done-recipes') }
      >
        Done Recipes
      </button>
      <br />

      <button
        type="button"
        data-testid="profile-favorite-btn"
        onClick={ () => history.push('/favorite-recipes') }
      >
        Favorite Recipes
      </button>
      <br />

      <button
        type="button"
        data-testid="profile-logout-btn"
        onClick={ logout }
      >
        Logout
      </button>
      <Footer />
    </div>
  );
}

Profile.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.string,
  }),
}.isRequired;
