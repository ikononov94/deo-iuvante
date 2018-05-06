import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './Chat.module.css';

import MessageBubble from '../BubbleNew/Bubble';
import ChatFooter from '../ChatFooter/ChatFooter';
import ViewportSpinner from '../ViewportSpinner/ViewportSpinner';

export default class Chat extends Component {
  componentDidUpdate(prevProps) {
    if (prevProps.messages.length !== this.props.messages.length) {
      if (this.props.messages[this.props.messages.length - 1].userId !== this.props.currentUserId) {
        this.props.readMessages(this.props.roomId);
      }
      if (this.container) this.container.scrollTop = this.container.scrollHeight;
    }
  }

  renderMessages() {
    if (!this.props.messages.length) {
      return <div className={styles.emptyState}>В этом чате пока нет сообщений</div>;
    }

    const aggregateMessage = message => (
      <MessageBubble
        isOwner={message.userId === this.props.currentUserId}
        message={message.text}
        viewState={message.read ? 'read' : 'delivered'} // should aslo handle pending and delivered state
        key={message._id}
        time={message.time}
        username={this.props.users.byId[message.userId] ? this.props.users.byId[message.userId].name : ''}
        usersCount={this.props.room.users.length}
      />
    );

    return this.props.messages.map(aggregateMessage);
  }

  render() {
    return (
      <div className={styles.chatContainer}>
        <div
          className={styles.chatMessages}
          ref={(container) => {
            this.container = container;
          }}
        >
          {this.props.isFetchingMessages ?
            <ViewportSpinner size="l" /> :
            this.renderMessages()
          }
        </div>
        <ChatFooter
          handleAttachment={() => {}}
          sendMessage={this.props.sendMessage}
          handleVoice={() => {}}
          className={styles.chatFooter}
          roomId={this.props.roomId}
        />
      </div>
    );
  }
}

Chat.defaultProps = {
  sendMessage: () => undefined,
  messages: [],
  isFetchingMessages: false,
};

Chat.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object),
  currentUserId: PropTypes.string.isRequired,
  sendMessage: PropTypes.func,
  readMessages: PropTypes.func.isRequired,
  roomId: PropTypes.string.isRequired,
  isFetchingMessages: PropTypes.bool,
  users: PropTypes.shape({
    fetching: PropTypes.bool,
    byId: PropTypes.objectOf(PropTypes.object),
  }).isRequired,
  room: PropTypes.shape({
    users: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};
