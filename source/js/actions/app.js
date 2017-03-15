export const SET_BREAKPOINT = 'SET_BREAKPOINT';
export const SET_ADMIN_MENU_VISIBILITY = 'SET_ADMIN_MENU_VISIBILITY';

export function setBreakpoint(breakpoint) {
  return {
    type: SET_BREAKPOINT,
    breakpoint,
  };
}

export function setAdminMenuVisibility(flag) {
  return {
    type: SET_ADMIN_MENU_VISIBILITY,
    flag,
  };
}
