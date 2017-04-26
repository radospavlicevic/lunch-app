import { createSelector } from 'reselect';

const getDishes = (state) => state.meals.get('dishes');
const getNoStandardDishes = (state) => state.meals.get('noStandardDishes');

function mapSingleSrLetter(letter) {
  switch (letter) {
    case 'č':
    case 'ć':
      return 'c';
    case 'š':
      return 's';
    case 'ž':
      return 'z';
    case 'đ':
      return 'dj';
    default:
      return '';
  }
}

const srLettersMap = ['č', 'ć', 'š', 'ž', 'đ'];

function mapSrLetters(text) {
  let mapped = '';
  for (let i = 0; i < text.length; i++) {
    mapped += srLettersMap.includes(text[i].toLowerCase()) ?
      mapSingleSrLetter(text[i].toLowerCase()) : text[i];
  }
  return mapped;
}

export const getDishesSearchSelector = createSelector(
    [getDishes],
    (dishes) => {
      const altDishes = { ...dishes };
      Object.keys(altDishes).forEach(dishKey => {
        altDishes[dishKey].altName = mapSrLetters(dishes[dishKey].name);
      });
      return altDishes;
    }
);

export const getNoStandardDishesSearchSelector = createSelector(
    [getNoStandardDishes],
    (dishes) => {
      const altDishes = { ...dishes };
      Object.keys(altDishes).forEach(dishKey => {
        altDishes[dishKey].altName = mapSrLetters(dishes[dishKey].name);
      });
      return altDishes;
    }
);
