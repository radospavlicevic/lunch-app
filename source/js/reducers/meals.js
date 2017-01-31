import { Map } from 'immutable';

import {
  ADD_CATEGORY,
  DELETE_CATEGORY,
} from 'actions/meals';

const initialState = Map({
  // fetch users
  categories: {},
});

const actionsMap = {

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
};

export default function reducer(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}
