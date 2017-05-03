export const SET_SELECTED_DATE = 'SET_SELECTED_DATE';
export const SET_REPORT_DATE = 'SET_REPORT_DATE';
export const UPDATE_ORDER = 'UPDATE_ORDER';
export const CANCEL_ORDER = 'CANCEL_ORDER';
export const LOAD_ORDERS = 'LOAD_ORDERS';

export function setSelectedDate(date) {
  return {
    type: SET_SELECTED_DATE,
    date,
  };
}

export function setReportDate(date) {
  return {
    type: SET_REPORT_DATE,
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

export function loadOrders(date, data) {
  return {
    type: LOAD_ORDERS,
    date,
    data,
  };
}
