export const SET_SELECTED_DATE = 'SET_SELECTED_DATE';
export const ADD_DISH_TO_ORDER = 'ADD_DISH_TO_ORDER';

export function setSelectedDate(date) {
  return {
    type: SET_SELECTED_DATE,
    date,
  };
}
