import React from 'react';

import testAvatar from './test-avatar.jpg';
import './Avatar.css';

function Avatar(props) {
  let size = props.size;
  if (['s', 'm', 'l'].indexOf(size) === -1) {
    size = 'm';
  }
  let modifier = `avatar_size_${size}`;

  let src = props.src || testAvatar;
  let alt = props.alt || 'avatar';

  return (
    <img src={src} className={`avatar ${modifier}`} alt={alt} />
  )
}

export default Avatar;
