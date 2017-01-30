export const ADD_CATEGORY = 'ADD_CATEGORY';
export const DELETE_CATEGORY = 'DELETE_CATEGORY';


export function addCategory(data) {
  return {
    type: ADD_CATEGORY,
    data,
  };
}

export function deleteCategory(uid) {
  return {
    type: DELETE_CATEGORY,
    uid,
  };
}
