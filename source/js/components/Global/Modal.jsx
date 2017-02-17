
import React, { Component, PropTypes } from 'react';

export default class Modal extends Component {
  static propTypes = {
    type: PropTypes.string,
    text: PropTypes.string,
  }

  renderTitle() {
    const { type } = this.props;
    switch (type) {
      case 'warning':
        return <h1>Warning</h1>;
      case 'error':
        return <h1>Error</h1>;
      default:
        return <h1>Info</h1>;
    }
  }

  render() {
    const { text } = this.props;
    return (
      <div className='ModalWrapper'>
        <div className='Modal'>
          { this.renderTitle() }
          <div className='ModalContent'>
            { text }
          </div>
        </div>
      </div>
    );
  }
}
