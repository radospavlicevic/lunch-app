import { Map } from 'immutable';

import {
  ADD_USER,
  DELETE_USER,
  UPDATE_USER,
  FETCH_USERS_START,
  FETCH_USERS_ERROR,
  FETCH_USERS_SUCCESS,
} from 'actions/users';

const initialState = Map({
  usersData: [],
  // userForUpdate: null,
});

const actionsMap = {
  // USERS actions
  [ADD_USER]: (state, action) => {
    let usersData = [...state.get('usersData')];
    if (!usersData.find(user => user.uid === action.data.uid)) {
      usersData = [...state.get('usersData'), action.data];
    }
    return state.merge(Map({
      'usersData': usersData,
    }));
  },
  [DELETE_USER]: (state, action) => {
    const usersData = state.get('usersData').filter(user => user.uid !== action.data.uid);
    return state.merge(Map({
      'usersData': usersData,
    }));
  },
  [UPDATE_USER]: (state, action) => {
    const usersData = [...state.get('usersData')];
    for (let i = 0; i < usersData.length; i++) {
      if (usersData[i].uid === action.data.uid) {
        usersData[i] = action.data;
      }
    }
    return state.merge(Map({
      'usersData': usersData,
    }));
  },
  [FETCH_USERS_START]: (state) => {
    return state.merge(Map({
      fetchUsersLoading: true,
      fetchUsersError: null,
    }));
  },
  [FETCH_USERS_ERROR]: (state, action) => {
    return state.merge(Map({
      fetchUsersLoading: false,
      fetchUsersError: action.error,
    }));
  },
  [FETCH_USERS_SUCCESS]: (state, action) => {
    return state.merge(Map({
      fetchUsersLoading: false,
      usersData: action.data,
    }));
  },
};

export default function reducer(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}
