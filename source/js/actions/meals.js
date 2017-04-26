export const DELETE_CATERING = 'DELETE_CATERING';
export const COUNT_CATERINGS = 'COUNT_CATERINGS';
export const ADD_OR_UPDATE_CATEGORY = 'ADD_OR_UPDATE_CATEGORY';
export const CANCEL_CATEGORY_UPDATE = 'CANCEL_CATEGORY_UPDATE';
export const DELETE_CATEGORY = 'DELETE_CATEGORY';
export const PREPARE_CATEGORY_UPDATE = 'PREPARE_CATEGORY_UPDATE';
export const COUNT_CATEGORIES = 'COUNT_CATEGORIES';
export const ADD_OR_UPDATE_DISHES = 'ADD_OR_UPDATE_DISHES';
export const ADD_OR_UPDATE_DISH = 'ADD_OR_UPDATE_DISH';
export const CANCEL_DISH_UPDATE = 'CANCEL_DISH_UPDATE';
export const DELETE_DISH = 'DELETE_DISH';
export const PREPARE_DISH_UPDATE = 'PREPARE_DISH_UPDATE';
export const ADD_OR_UPDATE_CATERING = 'ADD_OR_UPDATE_CATERING';
export const CANCEL_CATERING_UPDATE = 'CANCEL_CATERING_UPDATE';
export const PREPARE_CATERING_UPDATE = 'PREPARE_CATERING_UPDATE';


export function addOrUpdateCatering(key, data) {
  return {
    type: ADD_OR_UPDATE_CATERING,
    key,
    data,
  };
}

export function cancelCateringUpdate() {
  return {
    type: CANCEL_CATERING_UPDATE,
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

export function cancelCategoryUpdate() {
  return {
    type: CANCEL_CATEGORY_UPDATE,
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

export function addOrUpdateDishes(data) {
  return {
    type: ADD_OR_UPDATE_DISHES,
    data,
  };
}

export function addOrUpdateDish(key, data) {
  return {
    type: ADD_OR_UPDATE_DISH,
    key,
    data,
  };
}

export function cancelDishUpdate() {
  return {
    type: CANCEL_DISH_UPDATE,
  };
}

export function prepareDishUpdate(key, data) {
  return {
    type: PREPARE_DISH_UPDATE,
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
