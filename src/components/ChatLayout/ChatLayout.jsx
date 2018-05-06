import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Popup from '../Popup/Popup';
import AppLayout from '../AppLayout/AppLayout';
import Avatar from '../Avatar/Avatar';
import IconButton from '../IconButton/IconButton';
import RoomMessages from '../../containers/RoomMessages';
import { leaveRoom } from '../../actions/rooms';

import styles from './ChatLayout.module.css';

function renderAvatar(chatName) {
  return <Avatar size="s" avatarName={chatName} />;
}

function renderGoBack() {
  return (
    <Link href="/" to="/" >
      <IconButton icon={{ color: '#fff', glyph: 'arrow_back' }} />
    </Link>
  );
}

class ChatLayout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      popupVisible: false,
    };
    this.hidePopup = this.hidePopup.bind(this);
    this.leaveRoom = this.leaveRoom.bind(this);
    this.showPopup = this.showPopup.bind(this);
  }

  showPopup() {
    this.setState({ popupVisible: true });
  }

  hidePopup() {
    this.setState({ popupVisible: false });
  }

  leaveRoom() {
    this.props.leaveRoom(this.props.roomId);
  }

  render() {
    const {
      chatName, roomId, chatNameAvatar, roomIsFetching, room,
    } = this.props;
    return (
      <AppLayout
        headerText={chatName}
        headerLeft={renderGoBack()}
        headerRight={renderAvatar(chatNameAvatar)}
        showPopup={this.showPopup}
      >
        { !roomIsFetching && <RoomMessages room={room} chatName={chatName} roomId={roomId} /> }
        {
          this.state.popupVisible &&
            <Popup close={this.hidePopup} withCloseButton>
              <div>Название комнаты: {chatName}</div>
              <div>
                Участники:
                {room.users.map(userId => this.props.users[userId].name).join(', ')}
              </div>
              <div>Участников в комнате: {room.users.length}</div>
              <Link to="/">
                <button className={styles.hidePopup} onClick={this.leaveRoom}>
                Выйти из чата
                </button>
              </Link>
            </Popup>
        }
      </AppLayout>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  leaveRoom: roomId => dispatch(leaveRoom(roomId)),
  dispatch,
});

const mapStateToProps = state => ({
  users: state.users.byId,
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatLayout);

ChatLayout.propTypes = {
  chatName: PropTypes.string,
  chatNameAvatar: PropTypes.string,
  roomId: PropTypes.string.isRequired,
  roomIsFetching: PropTypes.bool,
  room: PropTypes.shape({
    _id: PropTypes.string,
  }),
  leaveRoom: PropTypes.func.isRequired,
  users: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
};
ChatLayout.defaultProps = {
  chatName: '',
  chatNameAvatar: ' ',
  roomIsFetching: false,
  room: {},
};
