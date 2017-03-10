import { Map } from 'immutable';

import {
  SET_BREAKPOINT,
} from 'actions/app';

const initialState = Map({
  breakpoint: '',
});

const actionsMap = {
  [SET_BREAKPOINT]: (state, action) => {
    return state.merge(Map({
      breakpoint: action.breakpoint,
    }));
  },
};

export default function reducer(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}
