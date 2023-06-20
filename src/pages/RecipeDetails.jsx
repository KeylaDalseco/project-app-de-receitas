import React, { useEffect, useState, useRef } from 'react';
import clipboardCopy from 'clipboard-copy';
import { useLocation, useHistory } from 'react-router-dom';
import share from '../images/share.png';
import heartWhite from '../images/heartWhite.png';
import heart from '../images/heart.png';
import { URL_FOOD, URL_DRINK, URL_MEALS, URL_DRINKS } from '../service/Links';
import '../style/RecipeDetails.css';

export default function RecipeDetails() {
  const location = useLocation();
  const history = useHistory();
  const [fetchApi, setFetchApi] = useState([]);
  const [isMeals, setIsMeals] = useState('');
  const [recommendationMeals, setrecommendationMeals] = useState([]);
  const [recommendationDrinks, setrecommendationDrinks] = useState([]);
  const [receipeInProgress, setReceipeInProgress] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const path = location.pathname.split('/')[1];
  const recommendation = async () => {
    if (path === 'meals') {
      const result = await fetch(URL_DRINKS);
      const data = await result.json();
      return setrecommendationMeals(data.drinks);
    }
    if (path === 'drinks') {
      const result = await fetch(URL_MEALS);
      const data = await result.json();
      return setrecommendationDrinks(data.meals);
    }
  };
  const handleShare = () => {
    const recipeLink = window.location.href;
    clipboardCopy(recipeLink)
      .then(() => setCopySuccess(true))
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    const urlParts = location.pathname.split('/');
    const urlId = urlParts[urlParts.length - 1];
    const existingFavorites = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    const isIdInArray = existingFavorites.some((recipe) => recipe.id === urlParts[2]);
    setFavorite(!!isIdInArray);
    const conditional = urlParts[1] === 'meals';
    setIsMeals(conditional);
    const fetchRecipe = async (id) => {
      if (location.pathname === `/meals/${id}`) {
        const result = await fetch(`${URL_FOOD}${id}`);
        const data = await result.json();
        setFetchApi(data.meals);
      }
      if (location.pathname === `/drinks/${id}`) {
        const result = await fetch(`${URL_DRINK}${id}`);
        const data = await result.json();
        setFetchApi(data.drinks);
      }
    };
    fetchRecipe(urlId);
    recommendation();
  }, [location.pathname]);
  const handleFavorite = () => {
    setFavorite(!favorite);
    const pathId = location.pathname.split('/')[2];
    const favoriteRecipe = fetchApi
      .find((recipe) => recipe.idMeal === pathId || recipe.idDrink === pathId);
    if (favoriteRecipe) {
      const isAlreadyFavorited = favoriteRecipes.some(
        (recipe) => recipe.id === favoriteRecipe.idMeal
        || recipe.id === favoriteRecipe.idDrink,
      );
      if (!isAlreadyFavorited) {
        const { idMeal, idDrink, strArea,
          strCategory, strAlcoholic, strMeal,
          strDrink, strMealThumb, strDrinkThumb } = favoriteRecipe;
        const newFavoriteRecipe = {
          id: idMeal || idDrink,
          type: isMeals ? 'meal' : 'drink',
          nationality: strArea || '',
          category: strCategory,
          alcoholicOrNot: strAlcoholic || '',
          name: strMeal || strDrink,
          image: strMealThumb || strDrinkThumb,
        };
        setFavoriteRecipes(
          (prevFavoriteRecipes) => [...prevFavoriteRecipes, newFavoriteRecipe],
        );
        setFavorite(true);
        localStorage.setItem('favoriteRecipes', JSON
          .stringify([...favoriteRecipes, newFavoriteRecipe]));
      }
    }
  };
  const getIngredientsList = (recipe) => {
    const ingredientsList = [];
    const number = 20;
    for (let i = 1; i <= number; i += 1) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== '') {
        ingredientsList.push(`${ingredient} - ${measure}`);
      }
    }
    return ingredientsList;
  };
  const btn = () => {
    const pathId2 = location.pathname.split('/')[2];
    setReceipeInProgress(true);
    history.push(`${pathId2}/in-progress`);
  };
  const number = 6;
  return (
    <div className="container">
      {fetchApi.map((recipes, index) => (
        <div key={ recipes.idMeal || recipes.idDrink } className="header-recipes">
          <div className="title-recipes-details">
            <p data-testid="recipe-title">{recipes.strMeal || recipes.strDrink}</p>
          </div>
          <div className="image-recipes">
            <img
              src={ recipes.strMealThumb || recipes.strDrinkThumb }
              alt={ recipes.strMeal || recipes.strDrink }
              data-testid="recipe-photo"
            />
          </div>
          <div className="recipe-category">
            <p data-testid="recipe-category">{recipes.strCategory}</p>
          </div>
          <div className="ingredients-instruction">
            <strong>Ingredients:</strong>
          </div>
          <div className="ingredient-container">
            <ul
              data-testid={ `${index}-ingredient-name-and-measure` }
              className="ingredient-list"
            >
              {getIngredientsList(recipes).map((ingredient, i) => (
                <li key={ i } data-testid={ `${i}-ingredient-name-and-measure` }>
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
          <div className="ingredients-instruction">
            <strong>Instructions:</strong>
          </div>
          <section
            className="instruction"
            data-testid="instructions"
          >
            {recipes.strInstructions}
          </section>
          {isMeals ? (
            <video src={ recipes.strYoutube } data-testid="video" controls>
              <track
                kind="captions"
                src="legenda.vtt"
                srcLang="pt"
                label="Português"
                default
              />
            </video>
          ) : (
            <p data-testid="recipe-category">{recipes.strAlcoholic}</p>
          )}
        </div>
      ))}
      {copySuccess && <p>Link copied!</p>}
      <div className="ingredients-instruction"><strong>Recommended</strong></div>
      <div
        className="recommendation-container"
      >
        {recommendationMeals.slice(0, number).map((recipe, index) => (
          <div
            key={ recipe.idDrink }
            data-testid={ `${index}-recommendation-card` }
            className="recomendation-card"
          >
            <div className="recomendation-card-image">
              <img
                src={ recipe.strDrinkThumb }
                alt="Recipe"
              />
            </div>
            <p data-testid={ `${index}-recommendation-title` }>{recipe.strDrink}</p>
          </div>
        ))}
        {recommendationDrinks.slice(0, number).map((recipe, index) => (
          <div
            key={ recipe.idMeal }
            data-testid={ `${index}-recommendation-card` }
            className="recomendation-card"
          >
            <div className="recomendation-card-image">
              <img
                src={ recipe.strMealThumb }
                alt="Recipe"
              />
            </div>
            <p data-testid={ `${index}-recommendation-title` }>{recipe.strMeal}</p>
          </div>
        ))}
      </div>
      { receipeInProgress ? (
        <button
          className="start-continue-recipe-btn"
          data-testid="start-recipe-btn"
          onClick={ btn }
        >
          Start Recipe
        </button>
      ) : (
        <button
          className="start-continue-recipe-btn"
          data-testid="start-recipe-btn"
          onClick={ btn }
        >
          Continue Recipe
        </button>)}
      <button
        data-testid="share-btn"
        onClick={ handleShare }
        className="share-btn"
      >
        <img
          src={ share }
          alt="Share"
        />
      </button>
      <button
        data-testid="favorite-btn"
        onClick={ handleFavorite }
        className="favorite-btn"
      >
        <img
          src={ favorite ? heart : heartWhite }
          data-testid="favorite-btn"
          alt="favorite"
        />
      </button>
    </div>
  );
}
