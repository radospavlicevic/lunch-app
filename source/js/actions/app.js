export const SET_BREAKPOINT = 'SET_BREAKPOINT';

export function setBreakpoint(breakpoint) {
  return {
    type: SET_BREAKPOINT,
    breakpoint,
  };
}
