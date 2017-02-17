export const ADD_DISH_IN_MENU = 'ADD_DISH_IN_MENU';
export const ADD_DISHES_IN_MENU = 'ADD_DISHES_IN_MENU';
export const REMOVE_DISH_FROM_MENU = 'REMOVE_DISH_FROM_MENU';
export const ADD_SELECTED_DISH = 'ADD_SELECTED_DISH';
export const REMOVE_SELECTED_DISH = 'REMOVE_SELECTED_DISH';

export function addDishInMenu(date, key, data) {
  return {
    type: ADD_DISH_IN_MENU,
    date,
    key,
    data,
  };
}

export function addDishesInMenu(date, dishes) {
  return {
    type: ADD_DISHES_IN_MENU,
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

export function addSelectedDish(key, data) {
  return {
    type: ADD_SELECTED_DISH,
    key,
    data,
  };
}

export function removeSelectedDish(key) {
  return {
    type: REMOVE_SELECTED_DISH,
    key,
  };
}
