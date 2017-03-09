export const DELETE_CATERING = 'DELETE_CATERING';
export const COUNT_CATERINGS = 'COUNT_CATERINGS';
export const ADD_OR_UPDATE_CATEGORY = 'ADD_OR_UPDATE_CATEGORY';
export const DELETE_CATEGORY = 'DELETE_CATEGORY';
export const PREPARE_CATEGORY_UPDATE = 'PREPARE_CATEGORY_UPDATE';
export const COUNT_CATEGORIES = 'COUNT_CATEGORIES';
export const ADD_OR_UPDATE_DISH = 'ADD_OR_UPDATE_DISH';
export const DELETE_DISH = 'DELETE_DISH';
export const PREPARE_DISH_UPDATE = 'PREPARE_DISH_UPDATE';
export const UPDATE_DISH = 'UPDATE_DISH';
export const ADD_OR_UPDATE_CATERING = 'ADD_OR_UPDATE_CATERING';
export const PREPARE_CATERING_UPDATE = 'PREPARE_CATERING_UPDATE';


export function addOrUpdateCatering(key, data) {
  return {
    type: ADD_OR_UPDATE_CATERING,
    key,
    data,
  };
}

export function prepareCateringUpdate(key, data) {
  return {
    type: PREPARE_CATERING_UPDATE,
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

export function addOrUpdateCategory(key, data) {
  return {
    type: ADD_OR_UPDATE_CATEGORY,
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

export function prepareCategoryUpdate(key, name) {
  return {
    type: PREPARE_CATEGORY_UPDATE,
    key,
    name,
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
