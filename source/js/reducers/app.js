import { Map } from 'immutable';

import {
  SET_BREAKPOINT,
  SET_ADMIN_MENU_VISIBILITY,
} from 'actions/app';

const initialState = Map({
  breakpoint: '',
  adminMenuVisibile: false,
});

const actionsMap = {
  [SET_BREAKPOINT]: (state, action) => {
    return state.merge(Map({
      breakpoint: action.breakpoint,
    }));
  },

  [SET_ADMIN_MENU_VISIBILITY]: (state, action) => {
    return state.merge(Map({
      adminMenuVisibile: action.flag,
    }));
  },
};

export default function reducer(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}
