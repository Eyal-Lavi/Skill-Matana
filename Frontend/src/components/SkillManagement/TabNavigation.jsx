import React from 'react';
import styles from './SkillManagement.module.scss';

const TabNavigation = ({ activeTab, onTabChange, existingCount, pendingCount }) => {
  return (
    <div className={styles.tabContainer}>
      <button
        className={`${styles.tabButton} ${activeTab === 'existing' ? styles.active : ''}`}
        onClick={() => onTabChange('existing')}
      >
        <span className={styles.tabIcon}>📚</span>
        Existing Skills
        <span className={styles.tabCount}>{existingCount}</span>
      </button>
      <button
        className={`${styles.tabButton} ${activeTab === 'pending' ? styles.active : ''}`}
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
