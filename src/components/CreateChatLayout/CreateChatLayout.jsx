import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import api from '../../api';

import { fetchUsers } from '../../actions/users';

import UsersList from '../UsersList/UsersList';
import AppLayout from '../AppLayout/AppLayout';
import IconButton from '../IconButton/IconButton';
import FormInput from '../FormInput/FormInput';
import Popup from '../Popup/Popup';

class CreateChat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedUsers: [],
      newRoomId: null,
      popupVisible: false,
      roomName: '',
    };

    this.switchUserSelection = this.switchUserSelection.bind(this);
    this.createRoom = this.createRoom.bind(this);
    this.showPopup = this.showPopup.bind(this);
    this.hidePopup = this.hidePopup.bind(this);
    this.handleRoomNameChange = this.handleRoomNameChange.bind(this);
  }

  componentWillMount() {
    this.props.fetchUsers();
  }

  switchUserSelection(id) {
    const userAlreadySelected = this.state.selectedUsers.indexOf(id) !== -1;

    if (userAlreadySelected) {
      this.setState({
        selectedUsers: this.state.selectedUsers.filter(userId => userId !== id),
      });
    } else {
      this.setState({
        selectedUsers: [].concat(this.state.selectedUsers, id),
      });
    }
  }

  showPopup() {
    if (this.state.selectedUsers.length < 2) {
      this.createRoom();
      return;
    }
    this.setState({ popupVisible: true });
  }

  hidePopup() {
    this.setState({ popupVisible: false });
  }

  handleRoomNameChange(event) {
    this.setState({ roomName: event.target.value });
  }

  createRoom() {
    api.createRoom({
      users: this.state.selectedUsers,
      name: this.state.roomName,
    })
      .then(({ _id }) => {
        this.setState({
          newRoomId: _id,
        });
      });
  }

  renderRedirect() {
    if (!this.state.newRoomId) return null;
    return <Redirect to={`/chat/${this.state.newRoomId}`} push />;
  }

  render() {
    return (
      <AppLayout
        headerText="Выберите пользователей"
        headerRight={(<IconButton
          icon={{ glyph: 'check', color: '#00a000' }}
          onClick={this.showPopup}
        />)}
        headerLeft={(<IconButton
          icon={{ glyph: 'keyboard_arrow_left', color: '#fff' }}
          component={Link}
          to="/"
        />)}
      >
        <React.Fragment>
          <UsersList
            switchUserSelection={this.switchUserSelection}
            selectedUsers={this.state.selectedUsers}
            users={this.props.users}
          />
          {this.renderRedirect()}
        </React.Fragment>
        {
          this.state.popupVisible &&
            <Popup close={this.hidePopup} withCloseButton>
              <FormInput
                label="Введите имя комнаты:"
                placeholder="Имя комнаты"
                onChange={this.handleRoomNameChange}
              />
              <button onClick={this.createRoom}>
              Создать комнату
              </button>
            </Popup>
        }
      </AppLayout>
    );
  }
}

function mapStateToProps(state) {
  const currentUserId = state.currentUser.data._id,
    users = Object.keys(state.users.byId).filter(_id => _id !== currentUserId).map(_id => state.users.byId[_id]);

  return ({
    users,
  });
}

CreateChat.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  fetchUsers: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { fetchUsers })(CreateChat);
