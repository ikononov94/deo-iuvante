import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { openRoom } from '../actions/rooms';

import ChatLayout from '../components/ChatLayout/ChatLayout';

function getChatName(room, currentUser) {
  if (room.users.length === 2) {
    const chatName = room.name.split(', ');
    return chatName.filter(name => name !== currentUser.name).join(' ');
  }
  return room.name;
}

class Room extends Component {
  componentDidMount() {
    const { match } = this.props;

    this.props.openRoom(match.params.id);
  }

  render() {
    const { room, currentUser } = this.props;

    if (room) {
      return (
        <ChatLayout
          chatName={getChatName(room, currentUser)}
          roomId={room._id}
          chatNameAvatar={room.name ? getChatName(room, currentUser) : 'R'}
          room={room}
        />
      );
    }

    return (
      <ChatLayout
        roomIsFetching
        roomId={this.props.match.params.id}
      />
    );
  }
}

const mapStateToProps = (state, { match }) => ({
  room: state.rooms.byId[match.params.id],
  currentUser: state.currentUser.data,
});

export default connect(mapStateToProps, { openRoom })(Room);

Room.propTypes = {
  openRoom: PropTypes.func.isRequired,
  room: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  currentUser: PropTypes.shape({
    _id: PropTypes.string,
  }).isRequired,
};
