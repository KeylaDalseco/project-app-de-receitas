import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import context from '../context/Context';
import '../style/HeaderAlign.css';
import coktail from '../images/cocktail.png';
import ordinaryDrink from '../images/ordinary.png';
import shake from '../images/shake.png';
import other from '../images/other.png';
import cocoa from '../images/cocoa.png';
import all from '../images/all.png';
import '../css/drinks.css';

export default function Drinks() {
  const { fetchData, requestApi, setResults, results } = useContext(context);

  const [category, setCategory] = useState([]);
  const [activeFilter, setActiveFilter] = useState(true);

  const twelve = 12;
  const returnsTwelve = results ? results.slice(0, twelve) : [];

  const five = 5;
  const categoryFive = category ? category.slice(0, five) : [];

  const urlCategory = 'https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list';
  const urlFilter = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=';

  useEffect(() => {
    const fetchCategory = async () => {
      const result = await fetch(urlCategory);
      const data = await result.json();
      const { drinks } = data;
      setCategory(drinks);
    };
    fetchData();
    fetchCategory();
  }, []);

  const handlClickDrink = async (filter) => {
    setActiveFilter(!activeFilter);
    if (activeFilter) {
      const searchApi = `${urlFilter}${filter}`;
      const result = await fetch(searchApi);
      const data = await result.json();
      const { drinks } = data;
      setResults(drinks);
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
              onClick={ () => handlClickDrink(categor.strCategory) }
            >
              {categor.strCategory}
              {categor.strCategory === 'Ordinary Drink' && (
                <img
                  className="filter-image"
                  src={ ordinaryDrink }
                  alt={ categor.strCategory }
                />
              )}
              {categor.strCategory === 'Cocktail' && (
                <img
                  className="filter-image"
                  src={ coktail }
                  alt={ categor.strCategory }
                />
              )}
              {categor.strCategory === 'Shake' && (
                <img
                  className="filter-image"
                  src={ shake }
                  alt={ categor.strCategory }
                />
              )}
              {categor.strCategory === 'Other / Unknown' && (
                <img
                  className="filter-image"
                  src={ other }
                  alt={ categor.strCategory }
                />
              )}
              {categor.strCategory === 'Cocoa' && (
                <img
                  className="filter-image"
                  src={ cocoa }
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
            src={ all }
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
              key={ intem.idDrink }
              className="recipe-card"
              data-testid={ `${index}-recipe-card` }
            >
              <Link to={ `/drinks/${intem.idDrink}` }>
                <h3
                  className="title"
                  data-testid={ `${index}-card-name` }
                >
                  {intem.strDrink}
                </h3>
                <img
                  className="recipe-image"
                  src={ intem.strDrinkThumb }
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
