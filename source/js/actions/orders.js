export const SET_SELECTED_DATE = 'SET_SELECTED_DATE';
export const UPDATE_ORDER = 'UPDATE_ORDER';

export function setSelectedDate(date) {
  return {
    type: SET_SELECTED_DATE,
    date,
  };
}

export function updateOrder(date, key, order) {
  return {
    type: UPDATE_ORDER,
    date,
    key,
    order,
  };
}
