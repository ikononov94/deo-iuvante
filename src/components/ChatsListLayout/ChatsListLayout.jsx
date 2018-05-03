import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { fetchRooms } from '../../actions/rooms';

import List from '../List/List';
import ChatsListItem from '../ChatsListItem/ChatsListItem';
import IconButton from '../IconButton/IconButton';
import AppLayout from '../AppLayout/AppLayout';

class ChatsList extends Component {
  componentDidMount() {
    this.props.fetchRooms();
  }

  renderChatsListItems() {
    if (!this.props.roomsIds) return '';
    return this.props.roomsIds
      .sort((rid1, rid2) => {
        const m1 = this.props.rooms[rid1].messages,
          m2 = this.props.rooms[rid2].messages;
        if (!m1[0] && m2[0]) return 1;
        if (m1[0] && !m2[0]) return -1;
        if (!m1[0] || !m2[0]) return 0;
        return this.props.messages[m2[m2.length - 1]].time - this.props.messages[m1[m1.length - 1]].time;
      })
      .map(roomId => (
        <ChatsListItem room={this.props.rooms[roomId]} messages={this.props.messages} key={roomId} />
      ));
  }

  render() {
    return (
      <AppLayout
        headerText="Чаты"
        headerRight={(
          <IconButton
            onClick={() => {}}
            icon={{ glyph: 'add', color: '#fff' }}
            component={Link}
            to="/create-chat"
          />
        )}
      >
        <List>
          {this.renderChatsListItems()}
        </List>
      </AppLayout>
    );
  }
}

ChatsList.propTypes = {
  rooms: PropTypes.objectOf(PropTypes.object).isRequired,
  roomsIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  fetchRooms: PropTypes.func.isRequired,
  messages: PropTypes.objectOf(PropTypes.object),
};

ChatsList.defaultProps = {
  messages: {},
};

const mapStateToProps = state => ({
  rooms: state.rooms.byId,
  roomsIds: state.rooms.allIds,
  messages: state.messages.byId,
});

export default connect(mapStateToProps, { fetchRooms })(ChatsList);
