import React from 'react';
import PropTypes from 'prop-types';

import List from '../List/List';
import UsersListItem from '../UsersListItem/UsersListItem';

function UsersList({ users, selectedUsers, switchUserSelection }) {
  return (
    <List>
      {users.map((user) => {
        if (user.name) {
          return (
            <UsersListItem
              {...user}
              key={user._id}
              onClick={() => switchUserSelection.call(null, user._id)}
              selected={selectedUsers.indexOf(user._id) !== -1}
            />);
        } return null;
})}
    </List>
  );
}

UsersList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    email: PropTypes.string,
    name: PropTypes.string.isRequired,
    phone: PropTypes.string,
    online: PropTypes.bool,
  })).isRequired,
  switchUserSelection: PropTypes.func.isRequired,
  selectedUsers: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default UsersList;
