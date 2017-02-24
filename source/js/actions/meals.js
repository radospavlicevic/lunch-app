export const ADD_CATERING = 'ADD_CATERING';
export const DELETE_CATERING = 'DELETE_CATERING';
export const COUNT_CATERINGS = 'COUNT_CATERINGS';
export const ADD_CATEGORY = 'ADD_CATEGORY';
export const DELETE_CATEGORY = 'DELETE_CATEGORY';
export const COUNT_CATEGORIES = 'COUNT_CATEGORIES';
export const ADD_OR_UPDATE_DISH = 'ADD_OR_UPDATE_DISH';
export const DELETE_DISH = 'DELETE_DISH';
export const PREPARE_DISH_UPDATE = 'PREPARE_DISH_UPDATE';
export const UPDATE_DISH = 'UPDATE_DISH';

export function addCatering(key, data) {
  return {
    type: ADD_CATERING,
    key,
    data,
  };
}

export function deleteCatering(key) {
  return {
    type: DELETE_CATERING,
    key,
  };
}

export function countCaterings(number) {
  return {
    type: COUNT_CATERINGS,
    number,
  };
}

export function addCategory(key, data) {
  return {
    type: ADD_CATEGORY,
    key,
    data,
  };
}

export function deleteCategory(key) {
  return {
    type: DELETE_CATEGORY,
    key,
  };
}

export function countCategories(number) {
  return {
    type: COUNT_CATEGORIES,
    number,
  };
}

export function addOrUpdateDish(key, data) {
  return {
    type: ADD_OR_UPDATE_DISH,
    key,
    data,
  };
}

export function prepareDishUpdate(key, data) {
  return {
    type: PREPARE_DISH_UPDATE,
    key,
    data,
  };
}

export function updateDish(key, data) {
  return {
    type: UPDATE_DISH,
    key,
    data,
  };
}

export function deleteDish(key) {
  return {
    type: DELETE_DISH,
    key,
  };
}
