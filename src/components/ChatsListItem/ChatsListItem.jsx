import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Avatar from '../Avatar/Avatar';
import styles from './ChatsListItem.module.css';

function prettifyLastActivity(lastActivity) {
  if (!lastActivity) return '';
  return new Date(lastActivity).toLocaleString('ru', {
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
}

function getChatName(room, currentUser) {
  if (room.users.length === 2) {
    const chatName = room.name.split(', ');
    return chatName.filter(name => name !== currentUser.name).join(' ');
  } else if (room.users.length > 2) {
    return 'Беседа';
  }
  return room.name;
}

function classNameMessage(hasReadMessage) {
  const classes = hasReadMessage ? ' ' : styles.hasReadMessage;
  return `${classes} ${styles.lastMessage}`;
}

function ChatsListItem(props) {
  const lastMessage = props.room.messages &&
    props.room.messages[0] &&
    props.room.messages[props.room.messages.length - 1] &&
    props.messages[props.room.messages[props.room.messages.length - 1]];
  const lastActivity = lastMessage ? lastMessage.time : null,
    hasReadMessage = lastMessage ? lastMessage.read : true;
  return (
    <Link to={`/chat/${props.room._id}`} className={styles.listItem}>
      <Avatar
        size="m"
        avatarName={props.room.name ? getChatName(props.room, props.currentUser) : 'R'}
        className={styles.avatar}
      />
      <span className={styles.roomName}>
        {getChatName(props.room, props.currentUser)}
      </span>
      <span className={classNameMessage(hasReadMessage)}>
        {(lastMessage && lastMessage.text) || 'В этом чате пока нет сообщений'}
      </span>
      <span className={styles.lastActivity}>
        {prettifyLastActivity(lastActivity)}
      </span>
    </Link>
  );
}

ChatsListItem.propTypes = {
  room: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    avatarUrl: PropTypes.string,
    name: PropTypes.string,
    messages: PropTypes.array,
  }).isRequired,
  messages: PropTypes.objectOf(PropTypes.object),
  currentUser: PropTypes.shape({
    _id: PropTypes.string,
  }).isRequired,
};

ChatsListItem.defaultProps = {
  messages: {},
};

export default ChatsListItem;
