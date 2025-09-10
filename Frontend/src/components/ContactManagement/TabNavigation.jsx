import React from 'react';
import styles from './ContactManagement.module.scss';

const TabNavigation = ({ activeTab, onTabChange, existingCount, pendingCount }) => {
  return (
    <div className={styles.tabContainer}>
      <button
        className={`${styles.tabButton} ${activeTab === 'connections' ? 'active' : ''}`}
        onClick={() => onTabChange('connections')}
      >
        <span className={styles.tabIcon}>👥</span>
        Connections
        <span className={styles.tabCount}>{existingCount}</span>
      </button>
      <button
        className={`${styles.tabButton} ${activeTab === 'pending' ? 'active' : ''}`}
        onClick={() => onTabChange('pending')}
      >
        <span className={styles.tabIcon}>⏳</span>
        Pending Requests
        <span className={styles.tabCount}>{pendingCount}</span>
      </button>
    </div>
  );
};

export default TabNavigation;
