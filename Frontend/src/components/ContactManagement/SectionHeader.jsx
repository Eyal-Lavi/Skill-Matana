import React from 'react';
import styles from './ContactManagement.module.scss';

const SectionHeader = ({ title, actionButton }) => {
  return (
    <div className={styles.sectionHeader}>
      <h2>{title}</h2>
      {actionButton}
    </div>
  );
};

export default SectionHeader;
