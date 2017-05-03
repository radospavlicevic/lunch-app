import { Map } from 'immutable';

import {
  DELETE_CATERING,
  COUNT_CATERINGS,
  ADD_OR_UPDATE_CATERING,
  CANCEL_CATERING_UPDATE,
  PREPARE_CATERING_UPDATE,
  ADD_OR_UPDATE_CATEGORY,
  CANCEL_CATEGORY_UPDATE,
  PREPARE_CATEGORY_UPDATE,
  CANCEL_DISH_UPDATE,
  DELETE_CATEGORY,
  COUNT_CATEGORIES,
  ADD_OR_UPDATE_DISH,
  LOAD_DISHES,
  LOAD_CATEGORIES,
  LOAD_CATERINGS,
  PREPARE_DISH_UPDATE,
  DELETE_DISH,
} from 'actions/meals';

const initialState = Map({
  categories: {
    main_dish: {
      name: 'Glavna jela',
    },
  },
  categoryForUpdate: null,
  cateringForUpdate: null,
  categoriesNumber: 0,
  caterings: {},
  cateringsNumber: 0,
  dishes: {},
  noStandardDishes: {},
  standardDishes: {},
  dishForUpdate: null,
});

const actionsMap = {

  [ADD_OR_UPDATE_CATERING]: (state, action) => {
    const newCatering = {};
    newCatering[action.key] = {
      name: action.data.name,
      contact: action.data.contact,
    };
    const caterings = Object.assign({}, state.get('caterings'), newCatering);
    return state.merge(Map({
      caterings,
      cateringForUpdate: null,
    }));
  },

  [CANCEL_CATERING_UPDATE]: (state) => {
    return state.merge(Map({
      cateringForUpdate: null,
    }));
  },

  [PREPARE_CATERING_UPDATE]: (state, action) => {
    return state.merge(Map({
      cateringForUpdate: {
        key: action.key,
        name: action.data.name,
        contact: action.data.contact,
      },
    }));
  },

  [DELETE_CATERING]: (state, action) => {
    const caterings = Object.assign({}, state.get('caterings'));
    delete caterings[action.key];
    return state.merge(Map({
      caterings,
    }));
  },

  [COUNT_CATERINGS]: (state, action) => {
    const number = action.number;
    return state.merge(Map({
      cateringsNumber: number,
    }));
  },

  [ADD_OR_UPDATE_CATEGORY]: (state, action) => {
    const newCategory = {};
    newCategory[action.key] = {
      name: action.data.name,
    };
    const categories = Object.assign({}, state.get('categories'), newCategory);
    return state.merge(Map({
      categories,
      categoryForUpdate: null,
    }));
  },

  [CANCEL_CATEGORY_UPDATE]: (state) => {
    return state.merge(Map({
      categoryForUpdate: null,
    }));
  },

  [PREPARE_CATEGORY_UPDATE]: (state, action) => {
    return state.merge(Map({
      categoryForUpdate: {
        key: action.key,
        name: action.name,
      },
    }));
  },

  [DELETE_CATEGORY]: (state, action) => {
    const categories = Object.assign({}, state.get('categories'));
    delete categories[action.key];
    return state.merge(Map({
      categories,
    }));
  },

  [COUNT_CATEGORIES]: (state, action) => {
    const number = action.number;
    return state.merge(Map({
      categoriesNumber: number,
    }));
  },

  [LOAD_DISHES]: (state, action) => {
    const dishes = Object.assign({}, action.data);
    const noStandardDishes = {};
    const standardDishes = {};
    Object.keys(dishes).forEach(dishKey => {
      if (dishes[dishKey].standard) {
        standardDishes[dishKey] = dishes[dishKey];
      } else {
        noStandardDishes[dishKey] = dishes[dishKey];
      }
    });
    return state.merge(Map({
      dishes,
      standardDishes,
      noStandardDishes,
    }));
  },

  [LOAD_CATEGORIES]: (state, action) => {
    const categories = { ...state.get('categories'), ...action.data };
    return state.merge(Map({
      categories,
    }));
  },

  [LOAD_CATERINGS]: (state, action) => {
    return state.merge(Map({
      caterings: action.data,
    }));
  },

  [ADD_OR_UPDATE_DISH]: (state, action) => {
    const newDish = {};
    newDish[action.key] = {
      catering: action.data.catering,
      category: action.data.category,
      name: action.data.name,
      description: action.data.description,
      standard: action.data.standard,
      price: action.data.price,
    };
    const dishes = Object.assign({}, state.get('dishes'), newDish);
    const noStandardDishes = Object.assign({}, state.get('noStandardDishes'),
      !newDish[action.key].standard && newDish);
    const standardDishes = Object.assign({}, state.get('standardDishes'),
      newDish[action.key].standard && newDish);
    return state.merge(Map({
      dishes,
      noStandardDishes,
      standardDishes,
      dishForUpdate: null,
    }));
  },

  [PREPARE_DISH_UPDATE]: (state, action) => {
    return state.merge(Map({
      dishForUpdate: {
        key: action.key,
        data: action.data,
      },
    }));
  },

  [CANCEL_DISH_UPDATE]: (state) => {
    return state.merge(Map({
      dishForUpdate: null,
    }));
  },

  [DELETE_DISH]: (state, action) => {
    const dishes = Object.assign({}, state.get('dishes'));
    const noStandardDishes = Object.assign({}, state.get('noStandardDishes'));
    const standardDishes = Object.assign({}, state.get('standardDishes'));
    delete dishes[action.key];
    delete noStandardDishes[action.key];
    delete standardDishes[action.key];
    return state.merge(Map({
      dishes,
      noStandardDishes,
      standardDishes,
    }));
  },
};

export default function reducer(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}
