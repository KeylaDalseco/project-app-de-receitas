import React, { useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useHistory } from 'react-router-dom';
import Context from './Context';
import profileIcon from '../images/profileIcon.svg';
import searchIcon from '../images/searchIcon.svg';

// EVITAR USAR O MESMO ESTADO PARA O FETCH DA API E ATUALIZAÇÃO DOS ESTADOS
const INICIAL_STATE = {
  inputSearch: '',
  inputRadio: '',
};

const URL_INGREDIENT_MEALS = 'https://www.themealdb.com/api/json/v1/1/filter.php?i=';
const URL_NAME_FOODS_MEALS = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
const URL_FIRST_LETTER_MEALS = 'https://www.themealdb.com/api/json/v1/1/search.php?f=';

const URL_INGREDIENT_DRINK = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=';
const URL_NAME_DRINK = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
const URL_FIRST_LETTER_DRINK = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?f=';

function Provider({ children }) {
  const location = useLocation();
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [searchForFoods, setSearchForFoods] = useState(INICIAL_STATE);
  const [notSearch, setNotSearch] = useState(false);
  const [requestApi, setRequestApi] = useState([]);
  // substituir o objeto de results pelo estado local
  const [results, setResults] = useState([]);

  const [headerState, setHeaderState] = useState({
    profile: profileIcon, search: searchIcon, renderHeader: true, title: '' });

  const fetchApi = useCallback(async (url) => {
    try {
      const result = await fetch(url);
      const data = await result.json();
      const { meals, drinks } = data;

      if (meals !== null && drinks !== null) {
        if (location.pathname === '/meals') {
          if (meals.length === 1) {
            history.push(`/meals/${data.meals[0].idMeal}`);
          }
          return data.meals;
        }
        if (location.pathname === '/drinks') {
          if (drinks.length === 1) {
            history.push(`/drinks/${data.drinks[0].idDrink}`);
          }
          return data.drinks;
        }
      } else {
        const message = 'Sorry, we haven\'t found any recipes for these filters.';
        global.alert(message);
      }
    } catch (error) {
      // console.log(error);
    }
  }, [history, location.pathname]);

  const fetchData = useCallback(async (search, inputText) => {
    let result;
    const urlIngredient = location.pathname === '/meals'
      ? `${URL_INGREDIENT_MEALS}${inputText}` : `${URL_INGREDIENT_DRINK}${inputText}`;

    const urlName = location.pathname === '/meals' ? `${URL_NAME_FOODS_MEALS}${inputText}`
      : `${URL_NAME_DRINK}${inputText}`;

    const urlFN = location.pathname === '/meals' ? `${URL_FIRST_LETTER_MEALS}${inputText}`
      : `${URL_FIRST_LETTER_DRINK}${inputText}`;

    const url = location.pathname === '/meals' ? `${URL_NAME_FOODS_MEALS}`
      : `${URL_NAME_DRINK}`;

    switch (search) {
    case 'Ingredient':
      result = await fetchApi(urlIngredient);
      setResults(result);
      break;
    case 'Name':
      result = await fetchApi(urlName);
      setResults(result);
      break;
    case 'FirstLetter':
      if (inputText.length > 1 && urlFN) {
        global.alert('Your search must have only 1 (one) character');
      }
      result = await fetchApi(urlFN);
      setResults(result);
      break;
    default:
      result = await fetchApi(url);
      setRequestApi(result);
      setResults(result);
      break;
    }
  }, [searchForFoods, location, fetchApi, results]);

  const value = useMemo(() => ({
    email,
    setEmail,
    searchForFoods,
    setSearchForFoods,
    fetchData,
    fetchApi,
    headerState,
    setHeaderState,
    notSearch,
    setNotSearch,
    requestApi,
    results,
    setResults,
  }), [email, searchForFoods, fetchData, fetchApi, headerState,
    notSearch, requestApi, results,
    setResults]);

  return (
    <Context.Provider value={ value }>
      {children}
    </Context.Provider>
  );
}
Provider.propTypes = {
  children: PropTypes.element.isRequired,
};
export default Provider;
