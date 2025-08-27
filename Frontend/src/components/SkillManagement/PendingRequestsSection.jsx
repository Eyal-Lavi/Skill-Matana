import React from 'react';
import SectionHeader from './SectionHeader';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import PendingSkillRequestsList from '../PendingSkillRequestsList';
import styles from './SkillManagement.module.scss';

const PendingRequestsSection = ({
  pendingLoading,
  pendingError,
  onRefresh
}) => {
  const refreshButton = (
    <button 
      className={styles.refreshButton}
      onClick={onRefresh}
      disabled={pendingLoading}
    >
      <span className={styles.buttonIcon}>🔄</span>
      Refresh
    </button>
  );

  return (
    <div className={styles.pendingRequests}>
      <SectionHeader 
        title="Pending Skill Requests" 
        actionButton={refreshButton}
      />

      {pendingLoading && <LoadingSpinner message="Loading requests..." />}

      {pendingError && <ErrorMessage message={pendingError} />}

      {!pendingLoading && !pendingError && <PendingSkillRequestsList />}
    </div>
  );
};

export default PendingRequestsSection;
