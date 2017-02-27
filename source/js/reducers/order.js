import { Map } from 'immutable';
import moment from 'moment';

import {
  SET_SELECTED_DATE,
} from 'actions/order';

const initialState = Map({
  selectedDate: moment().format('DD-MM-YYYY'),
});

const actionsMap = {

  [SET_SELECTED_DATE]: (state, action) => {
    return state.merge(Map({
      selectedDate: action.date,
    }));
  },
};

export default function reducer(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}
