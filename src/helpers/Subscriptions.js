import React from 'react';
import PropTypes from 'prop-types';
import { addMessage, readMessages } from '../actions/messages';
import { fetchRoom, userLeavedRoom } from '../actions/rooms';
import { userChangeStatus, updateUser } from '../actions/users';

import api from '../api';

export default (WrappedComponent) => {
  class Subscriptions extends React.Component {
    constructor(props) {
      super(props);

      this.receiveMessage = this.receiveMessage.bind(this);
      this.readMessages = this.readMessages.bind(this);
      this.userLeavedRoom = this.userLeavedRoom.bind(this);
      this.userChangeStatus = this.userChangeStatus.bind(this);
      this.updateUser = this.updateUser.bind(this);
    }

    componentDidMount() {
      api.onMessage(this.receiveMessage);

      api.onMessagesRead(this.readMessages);

      api.onUserLeavedRoom(this.userLeavedRoom);

      api.onUserChangeStatus(this.userChangeStatus);

      api.onNewRoom(roomId => this.props.dispatch(fetchRoom(roomId)));

      api.onUpdateUser(this.updateUser);
    }

    componentWillUnmount() {
      api.offMessage();
      api.offMessagesRead();
    }

    updateUser(user) {
      this.props.dispatch(updateUser(user));
    }

    userLeavedRoom(params) {
      this.props.dispatch(userLeavedRoom(params));
    }

    userChangeStatus({ status, userId }) {
      this.props.dispatch(userChangeStatus({ status, userId }));
    }

    receiveMessage(message) {
      this.props.dispatch(addMessage(message));
    }

    readMessages(roomId) {
      this.props.dispatch(readMessages(roomId));
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }
  Subscriptions.displayName =
    `SubscribeOnMessage(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  Subscriptions.propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  return Subscriptions;
};
