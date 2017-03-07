export const SET_SELECTED_DATE = 'SET_SELECTED_DATE';
export const UPDATE_ORDER = 'UPDATE_ORDER';
export const CANCEL_ORDER = 'CANCEL_ORDER';

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

export function cancelOrder(date, uid) {
  return {
    type: CANCEL_ORDER,
    date,
    uid,
  };
}
