import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { openRoom } from '../actions/rooms';

import ChatLayout from '../components/ChatLayout/ChatLayout';

class Room extends Component {
  componentDidMount() {
    const { match } = this.props;

    this.props.openRoom(match.params.id);
  }

  render() {
    const { room } = this.props;

    if (room) {
      return (
        <ChatLayout
          chatName={room.name}
          roomId={room._id}
          chatNameAvatar={room.name ? room.name.slice(0, 2) : 'R'}
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
};
