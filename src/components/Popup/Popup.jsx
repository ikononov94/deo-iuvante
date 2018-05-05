import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '../IconButton/IconButton';

import styles from './Popup.module.css';

function Popup({
  children,
  close,
  fullSized,
  withCloseButton,
}) {
  return (
    <div className={styles.gag} onClick={close}>
      <div className={`${styles.popupContainer} ${fullSized ? styles.popupFullSize : ''}`}>
        {children}
        {
          withCloseButton &&
          <IconButton
            onClick={close}
            icon={{ color: 'rgb(0,191,243)', glyph: 'close' }}
            className={styles.closeButton}
          />
        }
      </div>
    </div>
  );
}

Popup.propTypes = {
  fullSized: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
  withCloseButton: PropTypes.bool,
  close: PropTypes.func,
};

Popup.defaultProps = {
  fullSized: false,
  withCloseButton: false,
  close: () => {},
};

export default Popup;
