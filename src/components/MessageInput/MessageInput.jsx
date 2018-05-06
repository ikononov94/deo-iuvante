import React, { Component } from 'react';
import PropTypes from 'prop-types';

import IconButton from '../IconButton/IconButton';

import './MessageInput.css';

class MessageInput extends Component {
  constructor(props) {
    super(props);

    this.state = { value: '' };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.input.focus();
  }

  handleSubmit(event) {
    event.preventDefault();

    if (!this.state.value.trim()) return;

    this.props.sendMessage(this.props.roomId, this.state.value);
    this.setState({ value: '' });
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
          ref={(input) => { this.input = input; }}
        />
        <IconButton
          icon={{
            color: '#a9d18b',
            glyph: 'send',
          }}
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
