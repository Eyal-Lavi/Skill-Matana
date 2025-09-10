import React from 'react';
import SectionHeader from './SectionHeader';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import PendingContactRequestsList from './PendingContactRequestsList';
import styles from './ContactManagement.module.scss';

const PendingRequestsSection = ({
  pendingLoading,
  pendingError,
  received = [],
  sent = [],
  onRefresh,
  onUpdateStatus,
  onCancel,
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
      <SectionHeader title="Pending Connection Requests" actionButton={refreshButton} />

      {pendingLoading && <LoadingSpinner message="Loading requests..." />}

      {pendingError && <ErrorMessage message={pendingError} />}

      {!pendingLoading && !pendingError && (
        <PendingContactRequestsList
          received={received}
          sent={sent}
          onUpdateStatus={onUpdateStatus}
          onCancel={onCancel}
        />
      )}
    </div>
  );
};

export default PendingRequestsSection;
