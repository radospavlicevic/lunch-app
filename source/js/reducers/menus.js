import { Map } from 'immutable';

import {
  ADD_DISH_TO_MENU,
  ADD_OR_UPDATE_MENU,
  REMOVE_DISH_FROM_MENU,
  SET_MENU_LOCK,
} from 'actions/menus';

const initialState = Map({
  menus: {},
});

const actionsMap = {
  [ADD_DISH_TO_MENU]: (state, action) => {
    const date = Object.assign({}, state.get('menus')[action.date], {
      [action.key]: action.data,
    });
    const menus = Object.assign({}, state.get('menus'), {
      [action.date]: date,
    });
    return state.merge(Map({
      menus,
    }));
  },

  [ADD_OR_UPDATE_MENU]: (state, action) => {
    const menus = Object.assign({}, state.get('menus'),
      {
        [action.date]: action.dishes,
      });
    return state.merge(Map({
      menus,
    }));
  },

  [REMOVE_DISH_FROM_MENU]: (state, action) => {
    const menus = Object.assign({}, state.get('menus'));
    delete menus[action.date][action.key];
    return state.merge(Map({
      menus,
    }));
  },

  [SET_MENU_LOCK]: (state, action) => {
    const menus = Object.assign({}, state.get('menus'));
    menus[action.date].locked = action.lock;
    return state.merge(Map({
      menus,
    }));
  },
};

export default function reducer(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}
