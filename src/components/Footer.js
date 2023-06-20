import React from 'react';
import { Link } from 'react-router-dom';
import drinkIcon from '../images/drinkIcon.svg';
import mealIcon from '../images/mealIcon.svg';
import '../style/Footer.css';

function Footer() {
  return (
    <footer
      data-testid="footer"
      className="footer"
    >
      <Link to="/drinks" data-testid="drinks-link">
        <img
          data-testid="drinks-bottom-btn"
          className="drink-icon"
          src={ drinkIcon }
          alt="Drinks"
        />
      </Link>
      <Link to="/meals" data-testid="meals-link">
        <img
          data-testid="meals-bottom-btn"
          className="meal-icon"
          src={ mealIcon }
          alt="Meals"
        />
      </Link>
    </footer>
  );
}

export default Footer;
