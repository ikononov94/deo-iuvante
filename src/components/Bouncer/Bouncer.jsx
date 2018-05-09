import React from 'react';
import PropTypes from 'prop-types';

import styles from './Bouncer.module.css';
import bc from '../../assets/bc.svg';

function Bouncer({ className }) {
  return (
    <div className={className}>
      <div className={styles.container}>
        <img src={bc} className={styles.Circle1} alt="" />
        <img src={bc} className={styles.Circle2} alt="" />
        <img src={bc} className={styles.Circle3} alt="" />
        <img src={bc} className={styles.Circle4} alt="" />
      </div>
    </div>
  );
}

Bouncer.propTypes = {
  className: PropTypes.string,
};

Bouncer.defaultProps = {
  className: '',
};

export default Bouncer;
