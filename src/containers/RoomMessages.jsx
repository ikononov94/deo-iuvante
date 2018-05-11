import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchMessages, sendMessage, markAllUnreadMessages } from '../actions/messages';
import { fetchUser, fetchUsers } from '../actions/users';

import Chat from '../components/Chat/Chat';

class RoomMessages extends Component {
  componentDidMount() {
    this.props.fetchMessages(this.props.roomId);
    if (this.props.messages.length &&
        this.props.messages[this.props.messages.length - 1].userId !== this.props.currentUserId) {
      this.props.readMessages(this.props.roomId);
    }
  }

  render() {
    return (
      <Chat
        messages={this.props.messages}
        currentUserId={this.props.currentUserId}
        sendMessage={this.props.sendMessage}
        roomId={this.props.roomId}
        isFetchingMessages={this.props.isFetchingMessages}
        users={this.props.users}
        readMessages={this.props.readMessages}
        room={this.props.room}
      />
    );
  }
}

const mapStateToProps = (state, { roomId }) => {
  const messages =
    state.rooms.byId[roomId].messages
      .map(messageId => state.messages.byId[messageId])
      .filter(message => typeof message !== 'undefined');

  return {
    messages,
    currentUserId: state.currentUser.data._id,
    users: state.users,
    isFetchingMessages: false,
  };
};

const mapDispatchToProps = dispatch => ({
  sendMessage: (roomId, message) => dispatch(sendMessage(roomId, message)),
  fetchMessages: roomId => dispatch(fetchMessages(roomId)),
  fetchUser: _id => dispatch(fetchUser(_id)),
  readMessages: roomId => dispatch(markAllUnreadMessages(roomId)),
  fetchUsers: filter => dispatch(fetchUsers(filter)),
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(RoomMessages);

RoomMessages.defaultProps = {
  isFetchingMessages: false,
  messages: [],
};

RoomMessages.propTypes = {
  fetchMessages: PropTypes.func.isRequired,
  sendMessage: PropTypes.func.isRequired,
  roomId: PropTypes.string.isRequired,
  currentUserId: PropTypes.string.isRequired,
  readMessages: PropTypes.func.isRequired,
  isFetchingMessages: PropTypes.bool,
  messages: PropTypes.arrayOf(PropTypes.object),
  users: PropTypes.shape({
    fetching: PropTypes.bool,
  }).isRequired,
  room: PropTypes.shape({
    _id: PropTypes.string,
  }).isRequired,
};
