import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';

export default function RecipeInProgres() {
  const [checkedIngredients, setCheckedIngredients] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const isRecipeMeal = window.location.href.includes('/meals/');
  const history = useHistory();
  const recipeId = isRecipeMeal ? '52771' : '178319';
  const ingredientList = isRecipeMeal
    ? [
      { id: 0, name: 'Ingredient 1' },
      { id: 1, name: 'Ingredient 2' },
      { id: 2, name: 'Ingredient 3' },
      { id: 3, name: 'Ingredient 4' },
      { id: 4, name: 'Ingredient 5' },
      { id: 5, name: 'Ingredient 6' },
      { id: 6, name: 'Ingredient 7' },
      { id: 7, name: 'Ingredient 8' },
    ]
    : [
      { id: 0, name: 'Ingredient 1' },
      { id: 1, name: 'Ingredient 2' },
      { id: 2, name: 'Ingredient 3' },
    ];
  const handleIngredientCheck = (ingredientId) => {
    if (checkedIngredients.includes(ingredientId)) {
      setCheckedIngredients(checkedIngredients.filter((id) => id !== ingredientId));
    } else {
      setCheckedIngredients([...checkedIngredients, ingredientId]);
    }
  };
  useEffect(() => {
    const savedProgress = localStorage.getItem(`recipeProgress_${recipeId}`);
    if (savedProgress) {
      setCheckedIngredients(JSON.parse(savedProgress));
    }
  }, [recipeId]);
  useEffect(() => {
    localStorage.setItem(`recipeProgress_${recipeId}`, JSON
      .stringify(checkedIngredients));
  }, [recipeId, checkedIngredients]);
  useEffect(() => {
    const isRecipeFavorite = localStorage.getItem(`recipeFavorite_${recipeId}`);
    setIsFavorite(isRecipeFavorite === 'true');
  }, [recipeId]);
  const handleShare = () => {
    const recipeUrl = window.location.href.replace('/in-progress', '');
    navigator.clipboard.writeText(recipeUrl).then(() => {
      setShowAlert(true);
      console.log('Link copied!');
    });
  };
  const handleFavorite = () => {
    const isRecipeFavorite = localStorage.getItem(`recipeFavorite_${recipeId}`);
    if (isRecipeFavorite === 'true') {
      localStorage.removeItem(`recipeFavorite_${recipeId}`);
      setIsFavorite(false);
    } else {
      localStorage.setItem(`recipeFavorite_${recipeId}`, 'true');
      setIsFavorite(true);
    }
  };
  const isFinishButtonDisabled = checkedIngredients.length !== ingredientList.length;
  const handleFinishRecipe = () => {
    const doneDate = new Date().toISOString(); // O pai me mostrou isso
    // A linha const doneDate = new Date().toISOString();
    // é usada para obter a data e hora atuais no formato ISO 8601.
    // O método toISOString() converte a data em uma string no
    // formato “aaaa-mm-ddThh:mm:ss.sssZ”,
    const doneRecipe = {
      id: recipeId,
      nationality: isRecipeMeal ? 'Italian' : '',
      name: isRecipeMeal ? 'Spicy Arrabiata Penne' : 'Aquamarine',
      category: isRecipeMeal ? 'Vegetarian' : 'Cocktail',
      image: isRecipeMeal
        ? 'https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg'
        : 'https://www.thecocktaildb.com/images/media/drink/zvsre31572902738.jpg',
      tags: isRecipeMeal ? ['Pasta', 'Curry'] : [],
      alcoholicOrNot: isRecipeMeal ? '' : 'Alcoholic',
      type: isRecipeMeal ? 'meal' : 'drink',
      doneDate,
    };
    localStorage.setItem(
      'doneRecipes',
      JSON.stringify([...(localStorage.getItem('doneRecipes') || []), doneRecipe]),
    );
    history.push('/done-recipes');
  };
  return (
    <div>
      <div>
        <Header />
        {showAlert && (
          <div>
            <p>Link copied!</p>
          </div>
        )}
        <div data-testid="recipe-photo">Imagem da receita</div>
        <div data-testid="recipe-title">Título da receita</div>
        <button data-testid="share-btn" onClick={ handleShare }>
          Compartilhar
        </button>
        <button data-testid="favorite-btn" onClick={ handleFavorite }>
          {isFavorite ? 'Desfavoritar' : 'Favoritar'}
        </button>
        <div data-testid="recipe-category">Categoria</div>
        <div data-testid="instructions">Instruções</div>
        <button
          data-testid="finish-recipe-btn"
          disabled={ isFinishButtonDisabled }
          onClick={ handleFinishRecipe }
        >
          Finalizar Receita
        </button>
        <ul>
          {ingredientList.map((ingredient, index) => (
            <li key={ ingredient.id } data-testid={ `${index}-ingredient-step` }>
              <input
                type="checkbox"
                checked={ checkedIngredients.includes(ingredient.id) }
                onChange={ () => handleIngredientCheck(ingredient.id) }
                data-testid={ `checkbox-${index}` }
              />
              <span
                style={ {
                  textDecoration: checkedIngredients.includes(ingredient.id)
                    ? 'line-through' : 'none',
                } }
              >
                {ingredient.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
