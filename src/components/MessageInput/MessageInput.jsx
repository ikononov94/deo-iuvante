import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './MessageInput.css';

class MessageInput extends Component {
  constructor(props) {
    super(props);

    this.state = { value: '' };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event) {
    this.props.sendMessage(this.props.roomId, this.state.value);

    this.setState({ value: '' });

    event.preventDefault();
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className={`message-input ${this.props.className}`}>
        <input
          type="text"
          placeholder="Type your message"
          value={this.state.value}
          onChange={this.handleChange}
        />
      </form>
    );
  }
}

MessageInput.propTypes = {
  sendMessage: PropTypes.func.isRequired,
  className: PropTypes.string,
  roomId: PropTypes.string.isRequired,
};

MessageInput.defaultProps = {
  className: '',
};

export default MessageInput;
