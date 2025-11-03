import React from 'react';
import styles from './NotificationManagement.module.scss';

const NotificationDetailsModal = ({ isOpen, onClose, loading, notification }) => {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Notification Details</h2>
          <button onClick={onClose} className={styles.modalCloseButton}>
            ×
          </button>
        </div>

        {loading ? (
          <div className={styles.modalLoading}>Loading details...</div>
        ) : notification ? (
          <div className={styles.modalBody}>
            <div className={styles.detailSection}>
              <h3>Notification Information</h3>
              <div className={styles.detailRow}>
                <span className={styles.label}>Type:</span>
                <span className={styles.value}>{notification.type}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>Title:</span>
                <span className={styles.value}>{notification.title}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>Message:</span>
                <span className={styles.value}>{notification.message}</span>
              </div>
              {notification.link && (
                <div className={styles.detailRow}>
                  <span className={styles.label}>Link:</span>
                  <span className={styles.value}>{notification.link}</span>
                </div>
              )}
              <div className={styles.detailRow}>
                <span className={styles.label}>Total Sent:</span>
                <span className={styles.value}>{notification.totalCount}</span>
              </div>
            </div>

            <div className={styles.detailSection}>
              <h3>Statistics</h3>
              <div className={styles.statsGrid}>
                <div className={styles.statBox}>
                  <div className={styles.statBoxLabel}>Read</div>
                  <div className={`${styles.statBoxValue} ${styles.readStat}`}>
                    {notification.readCount}
                  </div>
                </div>
                <div className={styles.statBox}>
                  <div className={styles.statBoxLabel}>Unread</div>
                  <div className={`${styles.statBoxValue} ${styles.unreadStat}`}>
                    {notification.unreadCount}
                  </div>
                </div>
                <div className={styles.statBox}>
                  <div className={styles.statBoxLabel}>Read Rate</div>
                  <div className={styles.statBoxValue}>
                    {notification.totalCount > 0
                      ? Math.round((notification.readCount / notification.totalCount) * 100)
                      : 0}
                    %
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.detailSection}>
              <h3>Read Users ({notification.readUsers?.length || 0})</h3>
              {notification.readUsers && notification.readUsers.length > 0 ? (
                <div className={styles.usersList}>
                  {notification.readUsers.map((user, index) => (
                    <div key={user?.id || index} className={styles.userItem}>
                      <div className={styles.userInfo}>
                        <span className={styles.userName}>
                          {user?.firstName} {user?.lastName}
                        </span>
                        <span className={styles.userDetails}>
                          @{user?.username} - {user?.email}
                        </span>
                      </div>
                      <span className={styles.readBadge}>✓ Read</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.noData}>No users have read this notification yet</p>
              )}
            </div>

            <div className={styles.detailSection}>
              <h3>Unread Users ({notification.unreadUsers?.length || 0})</h3>
              {notification.unreadUsers && notification.unreadUsers.length > 0 ? (
                <div className={styles.usersList}>
                  {notification.unreadUsers.map((user, index) => (
                    <div key={user?.id || index} className={styles.userItem}>
                      <div className={styles.userInfo}>
                        <span className={styles.userName}>
                          {user?.firstName} {user?.lastName}
                        </span>
                        <span className={styles.userDetails}>
                          @{user?.username} - {user?.email}
                        </span>
                      </div>
                      <span className={styles.unreadBadge}>Unread</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.noData}>All users have read this notification</p>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.modalError}>Failed to load notification details</div>
        )}

        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.modalCloseBtn}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetailsModal;

