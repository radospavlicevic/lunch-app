import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { BREAKPOINTS } from 'utils/globals';
import { setBreakpoint } from 'actions/app';

@connect(state => ({
  breakpoint: state.app.get('breakpoint'),
}))
export default ComposedComponent => class AppBreakpointsDecorator extends Component {

  static propTypes = {
    breakpoint: PropTypes.string,
    dispatch: PropTypes.func,
  }

  constructor() {
    super();

    this.handleResize = this.handleResize.bind(this);
  }

  getBreakpoint() {
    const width = window.innerWidth;
    if (width < BREAKPOINTS.md) {
      return 'sm';
    }

    if (width < BREAKPOINTS.lg) {
      return 'md';
    }

    if (width < BREAKPOINTS.xl) {
      return 'lg';
    }

    return 'xl';
  }

  componentWillMount() {
    const { dispatch } = this.props;

    dispatch(setBreakpoint(this.getBreakpoint()));
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    clearTimeout(this.timeoutID);
    this.timeoutID = null;
  }

  handleResize() {
    const {
      breakpoint,
      dispatch,
    } = this.props;
    const newBreakpoint = this.getBreakpoint();

    if (breakpoint !== newBreakpoint) {
      clearTimeout(this.timeoutID);
      this.timeoutID = setTimeout(() => {
        dispatch(setBreakpoint(newBreakpoint));
      }, 200);
    }
  }

  render() {
    return (
      <ComposedComponent { ...this.props } />
    );
  }
};
