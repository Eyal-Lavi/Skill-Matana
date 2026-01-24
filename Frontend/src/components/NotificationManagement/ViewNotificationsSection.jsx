import React, { useState, useEffect } from 'react';
import AdminAPI from '../../features/admin/adminAPI';
import NotificationDetailsModal from './NotificationDetailsModal';
import styles from './NotificationManagement.module.scss';
import { useToast } from '../../contexts/ToastContext';

const ViewNotificationsSection = () => {
  const toast = useToast();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [notificationDetails, setNotificationDetails] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await AdminAPI.getNotificationGroupedStats();
      setStats(response.data || []);
    } catch (err) {
      console.error('Failed to load notification stats:', err);
      setError(err.response?.data?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (notification) => {
    try {
      setDetailsLoading(true);
      setSelectedNotification(notification);
      const details = await AdminAPI.getNotificationDetails(
        notification.type,
        notification.title,
        notification.message,
        notification.link || null
      );
      setNotificationDetails(details);
    } catch (err) {
      console.error('Failed to load notification details:', err);
      toast.error(err.response?.data?.message || 'Failed to load notification details');
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedNotification(null);
    setNotificationDetails(null);
  };

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

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}>Loading notifications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorMessage}>{error}</div>
        <button onClick={loadStats} className={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.viewSection}>
      <div className={styles.viewHeader}>
        <h2>All Notifications</h2>
        <button onClick={loadStats} className={styles.refreshButton}>
          🔄 Refresh
        </button>
      </div>

      {stats.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No notifications found</p>
          <p className={styles.emptySubtext}>
            Notifications will appear here once created
          </p>
        </div>
      ) : (
        <div className={styles.statsList}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <div className={styles.statHeader}>
                <div className={styles.statTitle}>
                  <h3>{stat.title}</h3>
                  <span className={styles.statType}>{stat.type}</span>
                </div>
                <button
                  onClick={() => handleViewDetails(stat)}
                  className={styles.viewDetailsButton}
                >
                  View Details
                </button>
              </div>

              <div className={styles.statMessage}>
                <p>{stat.message}</p>
              </div>

              {stat.link && (
                <div className={styles.statLink}>
                  <span className={styles.label}>Link:</span>
                  <span className={styles.value}>{stat.link}</span>
                </div>
              )}

              <div className={styles.statInfo}>
                <div className={styles.statItem}>
                  <span className={styles.label}>Total Sent:</span>
                  <span className={styles.value}>{stat.totalCount}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.label}>Read:</span>
                  <span className={`${styles.value} ${styles.readCount}`}>
                    {stat.readCount}
                  </span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.label}>Unread:</span>
                  <span className={`${styles.value} ${styles.unreadCount}`}>
                    {stat.unreadCount}
                  </span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.label}>Read Rate:</span>
                  <span className={styles.value}>
                    {stat.totalCount > 0
                      ? Math.round((stat.readCount / stat.totalCount) * 100)
                      : 0}
                    %
                  </span>
                </div>
              </div>

              <div className={styles.statDates}>
                <div className={styles.statDateItem}>
                  <span className={styles.label}>First Sent:</span>
                  <span className={styles.value}>{formatDate(stat.firstSent)}</span>
                </div>
                <div className={styles.statDateItem}>
                  <span className={styles.label}>Last Sent:</span>
                  <span className={styles.value}>{formatDate(stat.lastSent)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedNotification && (
        <NotificationDetailsModal
          isOpen={!!selectedNotification}
          onClose={handleCloseModal}
          loading={detailsLoading}
          notification={notificationDetails}
        />
      )}
    </div>
  );
};

export default ViewNotificationsSection;

