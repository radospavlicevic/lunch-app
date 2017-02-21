export const SET_SELECTED_DATE = 'SET_SELECTED_DATE';

export function setSelectedDate(date) {
  return {
    type: SET_SELECTED_DATE,
    date,
  };
}
