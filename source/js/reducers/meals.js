import { Map } from 'immutable';

import {
  ADD_CATERING,
  DELETE_CATERING,
  COUNT_CATERINGS,
  ADD_CATEGORY,
  DELETE_CATEGORY,
  COUNT_CATEGORIES,
  ADD_OR_UPDATE_DISH,
  PREPARE_DISH_UPDATE,
  COMPLETE_DISH_UPDATE,
  DELETE_DISH,
} from 'actions/meals';

const initialState = Map({
  categories: {},
  categoriesNumber: 0,
  caterings: {},
  cateringsNumber: 0,
  dishes: {},
  dishForUpdate: null,
});

const actionsMap = {
  [ADD_CATERING]: (state, action) => {
    const newCatering = {};
    newCatering[action.key] = action.data;
    const caterings = Object.assign({}, state.get('caterings'), newCatering);
    return state.merge(Map({
      'caterings': caterings,
    }));
  },

  [DELETE_CATERING]: (state, action) => {
    const caterings = Object.assign({}, state.get('caterings'));
    delete caterings[action.key];
    return state.merge(Map({
      'caterings': caterings,
    }));
  },

  [COUNT_CATERINGS]: (state, action) => {
    const number = action.number;
    return state.merge(Map({
      'cateringsNumber': number,
    }));
  },

  [ADD_CATEGORY]: (state, action) => {
    const newCategory = {};
    newCategory[action.key] = {
      name: action.data,
    };
    const categories = Object.assign({}, state.get('categories'), newCategory);
    return state.merge(Map({
      'categories': categories,
    }));
  },

  [DELETE_CATEGORY]: (state, action) => {
    const categories = Object.assign({}, state.get('categories'));
    delete categories[action.key];
    return state.merge(Map({
      'categories': categories,
    }));
  },

  [COUNT_CATEGORIES]: (state, action) => {
    const number = action.number;
    return state.merge(Map({
      'categoriesNumber': number,
    }));
  },

  [ADD_OR_UPDATE_DISH]: (state, action) => {
    const newDish = {};
    newDish[action.key] = {
      catering: action.data.catering,
      category: action.data.category,
      name: action.data.name,
      description: action.data.description,
      price: action.data.price,
    };
    const dishes = Object.assign({}, state.get('dishes'), newDish);
    return state.merge(Map({
      'dishes': dishes,
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

  [COMPLETE_DISH_UPDATE]: (state) => {
    return state.merge(Map({
      dishForUpdate: null,
    }));
  },

  [DELETE_DISH]: (state, action) => {
    const dishes = Object.assign({}, state.get('dishes'));
    delete dishes[action.key];
    return state.merge(Map({
      'dishes': dishes,
    }));
  },
};

export default function reducer(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}
