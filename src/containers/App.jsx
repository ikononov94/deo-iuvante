import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import ChatsList from '../components/ChatsListLayout/ChatsListLayout';
import CreateChat from '../components/CreateChatLayout/CreateChatLayout';
import Room from './Room';
import FirstTime from '../components/FirstTime/FirstTime';
import ViewportSpinner from '../components/ViewportSpinner/ViewportSpinner';

import { fetchCurrentUser } from '../actions/currentUser';
import { fetchUsers } from '../actions/users';

import Subscriptions from '../helpers/Subscriptions';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.renderChatsList = this.redirectIfCurrentUserIsEmpty.bind(this, ChatsList);
    this.renderCreateChat = this.redirectIfCurrentUserIsEmpty.bind(this, CreateChat);
    this.renderChat = this.redirectIfCurrentUserIsEmpty.bind(this, Room);
    this.renderFirstTime = this.redirectIfCurrentUserIsPresent.bind(this, FirstTime);
  }

  componentDidMount() {
    this.props.dispatch(fetchCurrentUser());
    this.props.fetchUsers();
  }

  currentUserIsEmpty() {
    const { name, email, phone } = this.props.currentUser;

    return [name, email, phone].every(field => field.length === 0);
  }

  redirectIfCurrentUserIsEmpty(Component, props) {
    return this.currentUserIsEmpty() ? <Redirect to="/first-time" /> : <Component {...props} />;
  }

  redirectIfCurrentUserIsPresent(Component, props) {
    return !this.currentUserIsEmpty() ? <Redirect to="/" /> : <Component {...props} />;
  }

  render() {
    const { isFetching } = this.props;

    if (isFetching) return <ViewportSpinner />;

    return (
      <Switch>
        <Route exact path="/" render={this.renderChatsList} />
        <Route path="/create-chat" render={this.renderCreateChat} />
        <Route path="/chat/:id" render={this.renderChat} />
        <Route path="/first-time" render={this.renderFirstTime} />
      </Switch>
    );
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
  }).isRequired,
  isFetching: PropTypes.bool.isRequired,
  fetchUsers: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { data, isFetching } = state.currentUser;

  return {
    currentUser: data,
    isFetching: !data._id || isFetching,
  };
};

const mapDispatchToProps = dispatch => ({
  fetchUsers: filter => dispatch(fetchUsers(filter)),
  dispatch,
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Subscriptions(App)));
