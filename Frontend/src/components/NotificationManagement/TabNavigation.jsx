import React from 'react';
import styles from './NotificationManagement.module.scss';

const TabNavigation = ({ activeTab, onTabChange, createCount, viewCount }) => {
  return (
    <div className={styles.tabContainer}>
      <button
        className={`${styles.tabButton} ${activeTab === 'create' ? styles.active : ''}`}
        onClick={() => onTabChange('create')}
      >
        <span className={styles.tabIcon}>➕</span>
        Create Notification
      </button>
      <button
        className={`${styles.tabButton} ${activeTab === 'view' ? styles.active : ''}`}
        onClick={() => onTabChange('view')}
      >
        <span className={styles.tabIcon}>👁️</span>
        View Notifications
        {viewCount > 0 && (
          <span className={styles.tabCount}>{viewCount}</span>
        )}
      </button>
    </div>
  );
};

export default TabNavigation;

