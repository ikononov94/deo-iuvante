import React from 'react';
import PropTypes from 'prop-types';

import styles from './ViewportSpinner.module.css';
import Bouncer from '../Bouncer/Bouncer';

const ViewportSpinner = () => <Bouncer className={styles.viewportSpinner} />;

export default ViewportSpinner;
