export const ADD_CATEGORY = 'ADD_CATEGORY';
export const DELETE_CATEGORY = 'DELETE_CATEGORY';


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
