import React from 'react';
import PropTypes from 'prop-types';

import Header from '../Header/Header';

import styles from './AppLayout.module.css';

function AppLayout({
  headerText,
  children,
  headerLeft,
  headerRight,
  showPopup,
}) {
  return (
    <div className={styles.app_layout}>
      <Header
        left={headerLeft}
        right={headerRight}
        className={styles.header}
        showPopup={showPopup}
      >
        {headerText}
      </Header>
      <div className={styles.main_area}>
        {children}
      </div>
    </div>
  );
}

AppLayout.propTypes = {
  headerText: PropTypes.node.isRequired,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]).isRequired,
  headerLeft: PropTypes.node,
  headerRight: PropTypes.node,
  showPopup: PropTypes.func,
};

AppLayout.defaultProps = {
  headerLeft: '',
  headerRight: '',
  showPopup: () => {},
};

export default AppLayout;
