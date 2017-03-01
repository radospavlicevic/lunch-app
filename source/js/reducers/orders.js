import { Map } from 'immutable';
import moment from 'moment';

import {
  SET_SELECTED_DATE,
  UPDATE_ORDER,
} from 'actions/orders';

const initialState = Map({
  selectedDate: moment().format('DD-MM-YYYY'),
  orders: {},
});

const actionsMap = {

  [SET_SELECTED_DATE]: (state, action) => {
    return state.merge(Map({
      selectedDate: action.date,
    }));
  },

  [UPDATE_ORDER]: (state, action) => {
    const orders = { ...state.get('orders') };
    orders[action.date] = {
      [action.key]: action.order,
    };

    return state.merge(Map({
      orders,
    }));
  },

};

export default function reducer(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}
