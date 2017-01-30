import { Map } from 'immutable';

import {
  ADD_CATEGORY,
  DELETE_CATEGORY,
} from 'actions/meals';

const initialState = Map({
  // fetch users
  categories: [],
});

const actionsMap = {

  [ADD_CATEGORY]: (state, action) => {
    const categories = [...state.get('categories'), action.data];
    return state.merge(Map({
      'categories': categories,
    }));
  },

  [DELETE_CATEGORY]: (state, action) => {
    const categories = state.get('categories').filter(category => category.uid !== action.uid);
    return state.merge(Map({
      'categories': categories,
    }));
  },
};

export default function reducer(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}
