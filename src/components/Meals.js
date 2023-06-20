import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import context from '../context/Context';
import '../style/HeaderAlign.css';
import '../css/meals.css';
import chickenImage from '../images/chicken.png';
import plate from '../images/plate.png';
import beefImage from '../images/meat.png';
import breakfast from '../images/breakfast.png';
import cupcake from '../images/cupcake.png';
import goat from '../images/goat.png';

export default function Meals() {
  const { fetchData, requestApi, setResults, results } = useContext(context);

  const [category, setCategory] = useState([]);
  const [activeFilter, setActiveFilter] = useState(true);

  const five = 5;
  const categoryFive = category ? category.slice(0, five) : [];

  const twelve = 12;
  const returnsTwelve = results ? results.slice(0, twelve) : [];

  const urlCategory = 'https://www.themealdb.com/api/json/v1/1/list.php?c=list';
  const urlFilter = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=';

  useEffect(() => {
    const fetchCategory = async () => {
      const result = await fetch(urlCategory);
      const data = await result.json();
      const { meals } = data;
      setCategory(meals);
    };

    fetchCategory();
    fetchData();
  }, []);

  const handlClickMeals = async (filter) => {
    setActiveFilter(!activeFilter);
    if (activeFilter) {
      const searchApi = `${urlFilter}${filter}`;
      const result = await fetch(searchApi);
      const data = await result.json();
      const { meals } = data;
      setResults(meals);
    } else {
      setResults(requestApi);
    }
  };

  const handlClickAll = async () => {
    setResults(requestApi);
  };

  return (
    <div className="HeaderAlign">
      <div className="filters-container">
        {
          categoryFive.map((categor, index) => (
            <button
              className="filters"
              data-testid={ `${categor.strCategory}-category-filter` }
              key={ index }
              onClick={ () => handlClickMeals(categor.strCategory) }
            >
              {categor.strCategory}
              {categor.strCategory === 'Chicken' && (
                <img
                  className="filter-image"
                  src={ chickenImage }
                  alt={ categor.strCategory }
                />
              )}
              {categor.strCategory === 'Beef' && (
                <img
                  className="filter-image"
                  src={ beefImage }
                  alt={ categor.strCategory }
                />
              )}
              {categor.strCategory === 'Breakfast' && (
                <img
                  className="filter-image"
                  src={ breakfast }
                  alt={ categor.strCategory }
                />
              )}
              {categor.strCategory === 'Dessert' && (
                <img
                  className="filter-image"
                  src={ cupcake }
                  alt={ categor.strCategory }
                />
              )}
              {categor.strCategory === 'Goat' && (
                <img
                  className="filter-image"
                  src={ goat }
                  alt={ categor.strCategory }
                />
              )}
            </button>
          ))
        }
        <button
          className="filters"
          data-testid="All-category-filter"
          onClick={ handlClickAll }
        >
          All
          <img
            src={ plate }
            className="filter-image"
            alt="All foods"
            style={ { width: '50px' } }
          />
        </button>
      </div>
      <div className="teste">
        {
          returnsTwelve.map((intem, index) => (
            <div
              className="recipe-card"
              key={ intem.idMeal }
              data-testid={ `${index}-recipe-card` }
            >
              <Link to={ `/meals/${intem.idMeal}` }>
                <h3
                  className="title"
                  data-testid={ `${index}-card-name` }
                >
                  {intem.strMeal}
                </h3>
                <img
                  className="recipe-image"
                  src={ intem.strMealThumb }
                  alt="Profile"
                  data-testid={ `${index}-card-img` }
                />
              </Link>
            </div>
          ))
        }
      </div>
    </div>
  );
}
