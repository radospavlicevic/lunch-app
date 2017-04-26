export const ADD_DISH_TO_MENU = 'ADD_DISH_TO_MENU';
export const ADD_OR_UPDATE_MENU = 'ADD_OR_UPDATE_MENU';
export const REMOVE_DISH_FROM_MENU = 'REMOVE_DISH_FROM_MENU';
export const SET_MENU_LOCK = 'SET_MENU_LOCK';

export function addDishToMenu(date, key, data) {
  return {
    type: ADD_DISH_TO_MENU,
    date,
    key,
    data,
  };
}

export function addOrUpdateMenu(date, dishes) {
  return {
    type: ADD_OR_UPDATE_MENU,
    date,
    dishes,
  };
}

export function removeDishFromMenu(date, key) {
  return {
    type: REMOVE_DISH_FROM_MENU,
    date,
    key,
  };
}

export function setMenuLock(date, lock) {
  return {
    type: SET_MENU_LOCK,
    date,
    lock,
  };
}
