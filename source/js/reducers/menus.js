import { Map } from 'immutable';

import {
  ADD_DISH_IN_MENU,
  ADD_DISHES_IN_MENU,
  REMOVE_DISH_FROM_MENU,
} from 'actions/menus';

const initialState = Map({
  menus: {},
});

const actionsMap = {
  [ADD_DISH_IN_MENU]: (state, action) => {
    const date = Object.assign({}, state.get('menus')[action.date], {
      [action.key]: action.data,
    });
    const menus = Object.assign({}, state.get('menus'), {
      [action.date]: date,
    });
    return state.merge(Map({
      'menus': menus,
    }));
  },

  [ADD_DISHES_IN_MENU]: (state, action) => {
    const menus = Object.assign({}, state.get('menus'),
      {
        [action.date]: action.dishes,
      });
    return state.merge(Map({
      'menus': menus,
    }));
  },

  [REMOVE_DISH_FROM_MENU]: (state, action) => {
    const menus = Object.assign({}, state.get('menus'));
    delete menus[action.date][action.key];
    return state.merge(Map({
      'menus': menus,
    }));
  },

  // [ADD_SELECTED_DISH]: (state, action) => {
  // const selected = Object.assign({}, state.get('selectedDishes'), { [action.key]: action.data });
  //   return state.merge(Map({
  //     selectedDishes: selected,
  //   }));
  // },
  //
  // [REMOVE_SELECTED_DISH]: (state, action) => {
  //   const selected = Object.assign({}, state.get('selectedDishes'));
  //   delete selected[action.key];
  //   return state.merge(Map({
  //     selectedDishes: selected,
  //   }));
  // },

};

export default function reducer(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}
