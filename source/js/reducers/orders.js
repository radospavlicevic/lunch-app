import { Map } from 'immutable';
import { DATE_PATTERN } from 'utils/globals';
import moment from 'moment';

import {
  SET_SELECTED_DATE,
  UPDATE_ORDER,
  CANCEL_ORDER,
} from 'actions/orders';

const initialState = Map({
  selectedDate: moment().add(1, 'weeks').startOf('isoWeek').format(DATE_PATTERN),
  orders: {},
});

const actionsMap = {

  [SET_SELECTED_DATE]: (state, action) => {
    return state.merge(Map({
      selectedDate: action.date,
    }));
  },

  [UPDATE_ORDER]: (state, action) => {
    let ordersForSelectedDate;
    if (!state.get('orders')[action.date]) {
      ordersForSelectedDate = {
        [action.date]: {
          [action.key]: action.order,
        },
      };
    } else {
      ordersForSelectedDate = {
        [action.date]: {
          ...state.get('orders')[action.date],
          [action.key]: action.order,
        },
      };
    }
    const orders = Object.assign({}, state.get('orders'), ordersForSelectedDate);

    return state.merge(Map({
      orders,
    }));
  },

  [CANCEL_ORDER]: (state, action) => {
    const orders = { ...state.get('orders') };
    delete orders[action.date][action.uid];

    return state.merge(Map({
      orders,
    }));
  },

};

export default function reducer(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}
