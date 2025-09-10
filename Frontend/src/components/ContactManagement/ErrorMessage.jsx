import React from 'react';
import styles from './ContactManagement.module.scss';

const ErrorMessage = ({ message }) => {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorIcon}>⚠️</div>
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
