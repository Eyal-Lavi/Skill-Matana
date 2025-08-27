import React from 'react';
import styles from './SkillManagement.module.scss';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p>{message}</p>
    </div>
  );
};

export default LoadingSpinner;
