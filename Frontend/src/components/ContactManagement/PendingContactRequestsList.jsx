import React from 'react';
import styles from './ContactManagement.module.scss';

const PendingContactRequestsList = ({ received = [], sent = [], onUpdateStatus, onCancel }) => {
  const hasNoRequests = (received?.length || 0) + (sent?.length || 0) === 0;

  if (hasNoRequests) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyIcon}>📭</div>
        <h3>No Pending Requests</h3>
        <p>You have no incoming or outgoing pending requests.</p>
      </div>
    );
  }

  return (
    <div>
      {received?.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ margin: '0 0 0.75rem 0' }}>Received</h3>
          <div className={styles.skillsGrid}>
            {received.map((req) => (
              <div key={req.id} className={styles.skillCard}>
                <div className={styles.skillInfo}>
                  <h4 className={styles.skillName}>
                    From: {req.requester?.firstName} {req.requester?.lastName}
                  </h4>
                  <span className={`${styles.statusBadge} ${styles.active}`}>{req.status}</span>
                </div>
                {req.message && <p style={{ color: '#475569', marginTop: '0.25rem' }}>{req.message}</p>}
                <div className={styles.skillActions}>
                  <button
                    className={`${styles.actionButton} ${styles.activateButton}`}
                    onClick={() => onUpdateStatus(req.id, 'approved')}
                  >
                    Approve
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.deactivateButton}`}
                    onClick={() => onUpdateStatus(req.id, 'rejected')}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {sent?.length > 0 && (
        <div>
          <h3 style={{ margin: '0 0 0.75rem 0' }}>Sent</h3>
          <div className={styles.skillsGrid}>
            {sent.map((req) => (
              <div key={req.id} className={styles.skillCard}>
                <div className={styles.skillInfo}>
                  <h4 className={styles.skillName}>
                    To: {req.recipient?.firstName} {req.recipient?.lastName}
                  </h4>
                  <span className={`${styles.statusBadge} ${styles.active}`}>{req.status}</span>
                </div>
                {req.message && <p style={{ color: '#475569', marginTop: '0.25rem' }}>{req.message}</p>}
                {req.status === 'pending' && (
                  <div className={styles.skillActions}>
                    <button
                      className={`${styles.actionButton} ${styles.deactivateButton}`}
                      onClick={() => onCancel && onCancel(req.id)}
                    >
                      Cancel Request
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingContactRequestsList;
