import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import shareIcon from '../images/shareIcon.svg';
import Header from '../components/Header';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import context from '../context/Context';

export default function DoneRecipes() {
  const { headerState, setHeaderState } = useContext(context);
  const [doneRecipes, setDoneRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const history = useHistory();

  useEffect(() => {
    setHeaderState({ ...headerState,
      title: 'Done Recipes',
      renderHeader: false });
  }, []);
  useEffect(() => {
    const doneRecipesData = localStorage.getItem('doneRecipes');
    if (doneRecipesData) {
      setDoneRecipes(JSON.parse(doneRecipesData));
    }
  }, []);

  useEffect(() => {
    setFilteredRecipes(doneRecipes);
  }, [doneRecipes]);

  const handleShare = (recipe) => {
    const recipeUrl = `http://localhost:3000/${recipe.type}s/${recipe.id}`;
    navigator.clipboard.writeText(recipeUrl)
      .then(() => {
        setShowAlert(true);
        console.log('Link copied!');
      });
  };

  const handleUnfavorite = (recipeId) => {
    const updatedRecipes = doneRecipes.filter((recipe) => recipe.id !== recipeId);
    setDoneRecipes(updatedRecipes);
    setFilteredRecipes(updatedRecipes);
    localStorage.setItem('doneRecipes', JSON.stringify(updatedRecipes));
  };

  const handleFilterByMeal = () => {
    const filteredMeals = doneRecipes.filter((recipe) => recipe.type === 'meal');
    setFilteredRecipes(filteredMeals);
  };

  const handleFilterByDrink = () => {
    const filteredDrinks = doneRecipes.filter((recipe) => recipe.type === 'drink');
    setFilteredRecipes(filteredDrinks);
  };

  const handleFilterByAll = () => {
    setFilteredRecipes(doneRecipes);
  };

  const handleRecipeClick = (recipeId, recipeType) => {
    history.push(`/${recipeType}s/${recipeId}`);
  };

  return (
    <div>
      <Header />
      {showAlert && (
        <div>
          <p>Link copied!</p>
        </div>
      )}
      <div>
        <button
          type="button"
          data-testid="filter-by-all-btn"
          onClick={ handleFilterByAll }
        >
          All
        </button>
        <button
          type="button"
          data-testid="filter-by-meal-btn"
          onClick={ handleFilterByMeal }
        >
          Meals
        </button>
        <button
          type="button"
          data-testid="filter-by-drink-btn"
          onClick={ handleFilterByDrink }
        >
          Drinks
        </button>
      </div>
      <div>
        {filteredRecipes.map((recipe, index) => (
          <div key={ index }>
            <button
              type="button"
              onClick={ () => handleRecipeClick(recipe.id, recipe.type) }
              style={ {
                border: 'none',
                background: 'none',
                padding: 0,
                cursor: 'pointer',
                display: 'block',
              } }
            >
              <p
                data-testid={ `${index}-horizontal-name` }
                style={ { textDecoration: 'underline' } }
              >
                {recipe.name}
              </p>
            </button>
            <button
              type="button"
              onClick={ () => handleRecipeClick(recipe.id, recipe.type) }
              style={ {
                border: 'none',
                background: 'none',
                padding: 0,
                cursor: 'pointer',
              } }
            >
              <img
                width={ 75 }
                src={ recipe.image }
                alt={ `Recipe ${index}` }
                data-testid={ `${index}-horizontal-image` }
              />
            </button>
            <p data-testid={ `${index}-horizontal-top-text` }>
              {`${recipe.nationality} - ${recipe.category} - ${
                recipe.alcoholicOrNot ? 'Alcoholic' : 'Not Alcoholic'
              }`}
            </p>
            <p data-testid={ `${index}-horizontal-done-date` }>
              {`Done: ${recipe.doneDate}`}
            </p>
            {recipe.tags && recipe.tags.map((tag, i) => (
              <span key={ i } data-testid={ `${index}-${tag}-horizontal-tag` }>
                {tag}
              </span>
            ))}
            <button type="button" onClick={ () => handleShare(recipe) }>
              <img
                data-testid={ `${index}-horizontal-share-btn` }
                src={ shareIcon }
                alt="Share"
                style={ { cursor: 'pointer' } }
              />
            </button>
            <button
              type="button"
              onClick={ () => handleUnfavorite(recipe.id) }
            >
              <img
                data-testid={ `${index}-horizontal-favorite-btn` }
                src={ blackHeartIcon }
                alt="Unfavorite"
                style={ { cursor: 'pointer' } }
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Recipes.propTypes = {
//   history: PropTypes.shape({
//     location: PropTypes.shape({
//       pathname: PropTypes.string,
//     }),
//   }).isRequired,
// };
