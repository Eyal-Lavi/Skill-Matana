import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import meetingsAPI from '../../services/meetingsAPI';
import notificationsAPI from '../../services/notificationsAPI';
import { useNotifications } from '../../contexts/NotificationsContext';
import { useToast } from '../../contexts/ToastContext';
import { useConfirm } from '../../contexts/ConfirmContext';
import styles from './Notifications.module.scss';

export default function Notifications() {
  const user = useSelector((s) => s.auth?.user);
  const { refreshUnreadCount } = useNotifications();
  const toast = useToast();
  const confirm = useConfirm();
  const [loading, setLoading] = useState(true);
  const [markAllLoading, setMarkAllLoading] = useState(false);
  const [error, setError] = useState('');
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [activeMeetings, setActiveMeetings] = useState([]);
  const [systemNotifications, setSystemNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [subscriptions, setSubscriptions] = useState([]);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      loadMeetings();
      loadSystemNotifications();
      loadSubscriptions();
    }
    
  
    const interval = setInterval(() => {
      if (user?.id) {
        loadMeetings();
        loadSystemNotifications();
        loadSubscriptions();
      }
    }, 60000);
    
    return () => clearInterval(interval);
  }, [user?.id]);

  const loadMeetings = async () => {
    try {
      setLoading(true);
      const response = await meetingsAPI.getMyMeetings('scheduled');
      console.log('Meetings response:', response);
      const meetings = response?.meetings || [];
      console.log('Raw meetings:', meetings);
      
      
      const now = new Date();
      const upcoming = meetings.filter(meeting => {
        const startTime = new Date(meeting.startTime);
        return startTime > now;
      });
      
      const active = meetings.filter(meeting => {
        const startTime = new Date(meeting.startTime);
        const endTime = new Date(meeting.endTime);
        return startTime <= now && endTime >= now;
      });
      
      console.log('Active meetings:', active);
      console.log('Upcoming meetings:', upcoming);
      
      setUpcomingMeetings(upcoming);
      setActiveMeetings(active);
    } catch (err) {
      console.error('Error loading meetings:', err);
      setError(err.message || 'Error loading meetings');
    } finally {
      setLoading(false);
    }
  };

  const loadSystemNotifications = async () => {
    try {
      const response = await notificationsAPI.getAll();
      setSystemNotifications(response?.data || []);
      setUnreadCount(response?.unread || 0);
    } catch (err) {
      console.error('Error loading system notifications:', err);
      setSystemNotifications([]);
      setUnreadCount(0);
    }
  };

  const loadSubscriptions = async () => {
    try {
      setLoadingSubscriptions(true);
      const res = await fetch('http://localhost:3000/availability/alerts/my/subscriptions', {
        credentials: 'include',
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        setSubscriptions(body?.subscriptions || []);
      }
    } catch (err) {
      console.error('Error loading subscriptions:', err);
      setSubscriptions([]);
    } finally {
      setLoadingSubscriptions(false);
    }
  };

  const handleUnsubscribe = async (targetUserId) => {
    const ok = await confirm({
      title: "Unsubscribe?",
      message:
        "Are you sure you want to unsubscribe from this email alert? You won't receive notifications about new availability.",
      confirmText: "Unsubscribe",
      cancelText: "Keep subscription",
      danger: true,
    });
    if (!ok) return;

    try {
      const res = await fetch(`http://localhost:3000/availability/alerts/${targetUserId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to unsubscribe from the alert');
      await loadSubscriptions();
      toast.success('Alert unsubscribed successfully.');
    } catch (err) {
      toast.error(err.message || 'Error unsubscribing from the alert');
    }
  };

  const handleCancelMeeting = async (meetingId) => {
    const ok = await confirm({
      title: "Cancel meeting?",
      message: "Are you sure you want to cancel the meeting?",
      confirmText: "Cancel meeting",
      cancelText: "Keep meeting",
      danger: true,
    });
    if (!ok) return;

    try {
      await meetingsAPI.cancelMeeting(meetingId);
      await loadMeetings();
    } catch (err) {
      toast.error(err.message || 'Error canceling meeting');
    }
  };

  const handleJoinMeeting = (meetingId) => {
    navigate(`/meeting/${meetingId}`);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationsAPI.markAsRead(notificationId);
      await loadSystemNotifications();
      // Refresh unread count immediately
      refreshUnreadCount();
    } catch (err) {
      console.error('Error marking notification as read:', err);
      const status = err?.response?.status;
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to mark notification as read';
      toast.error(msg);
      if (status === 401) {
        toast.info('Your session has expired. Please log in again.');
        navigate('/auth/login');
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    if (markAllLoading) return;
    if (unreadCount <= 0) {
      toast.info('No unread notifications.');
      return;
    }
    try {
      setMarkAllLoading(true);
      await notificationsAPI.markAllAsRead();
      await loadSystemNotifications();
      // Refresh unread count immediately
      refreshUnreadCount();
      toast.success('All notifications marked as read.');
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      const status = err?.response?.status;
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to mark all notifications as read';
      toast.error(msg);
      if (status === 401) {
        toast.info('Your session has expired. Please log in again.');
        navigate('/auth/login');
      }
    } finally {
      setMarkAllLoading(false);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    const ok = await confirm({
      title: "Delete notification?",
      message: "Are you sure you want to delete this notification?",
      confirmText: "Delete",
      cancelText: "Cancel",
      danger: true,
    });
    if (!ok) return;
    try {
      await notificationsAPI.delete(notificationId);
      await loadSystemNotifications();
      // Refresh unread count immediately
      refreshUnreadCount();
    } catch (err) {
      console.error('Error deleting notification:', err);
      toast.error(err.response?.data?.message || 'Error deleting notification');
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    if (notification.link) {
      window.open(notification.link, '_blank');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMeetingPartner = (meeting) => {
    const currentUserId = user?.id;
    if (currentUserId === meeting.host?.id) {
      return meeting.guest;
    }
    return meeting.host;
  };

  const isMeetingUpcomingSoon = (meeting) => {
    const startTime = new Date(meeting.startTime);
    const now = new Date();
    const hoursUntilMeeting = (startTime - now) / (1000 * 60 * 60);
    return hoursUntilMeeting <= 24 && hoursUntilMeeting > 0;
  };

  const sortedMeetings = useMemo(() => {
    return [...upcomingMeetings].sort((a, b) => {
      return new Date(a.startTime) - new Date(b.startTime);
    });
  }, [upcomingMeetings]);

  const upcomingMeetingsPreview = useMemo(() => {
    return sortedMeetings.slice(0, 5);
  }, [sortedMeetings]);

  const unreadNotifications = useMemo(() => {
    return systemNotifications.filter(n => !n.isRead).slice(0, 5);
  }, [systemNotifications]);

  const totalRelevantCount = useMemo(() => {
    return activeMeetings.length + 
           (upcomingMeetings.length > 0 ? 1 : 0) + 
           unreadCount;
  }, [activeMeetings.length, upcomingMeetings.length, unreadCount]);

  return (
    <div className={styles.notificationsContainer}>
      <div className={styles.header}>
        <h1>Notifications</h1>
        <p>Updates on upcoming meetings and system notifications</p>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
          {totalRelevantCount > 0 && (
            <span className={styles.badge}>{totalRelevantCount}</span>
          )}
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'active' ? styles.active : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active Now
          {activeMeetings.length > 0 && (
            <span className={styles.badge}>{activeMeetings.length}</span>
          )}
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'meetings' ? styles.active : ''}`}
          onClick={() => setActiveTab('meetings')}
        >
          Upcoming Meetings
          {upcomingMeetings.length > 0 && (
            <span className={styles.badge}>{upcomingMeetings.length}</span>
          )}
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'system' ? styles.active : ''}`}
          onClick={() => setActiveTab('system')}
        >
          System Notifications
          {unreadCount > 0 && (
            <span className={styles.badge}>{unreadCount}</span>
          )}
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'alerts' ? styles.active : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          Alert Subscriptions
          {subscriptions.filter(s => s.active).length > 0 && (
            <span className={styles.badge}>{subscriptions.filter(s => s.active).length}</span>
          )}
        </button>
      </div>

      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : activeTab === 'overview' ? (
          <div className={styles.overviewSection}>
            {activeMeetings.length > 0 && (
              <div className={styles.overviewGroup}>
                <h2 className={styles.overviewGroupTitle}>
                  🔴 Active Now ({activeMeetings.length})
                </h2>
                <div className={styles.overviewList}>
                  {activeMeetings.slice(0, 3).map((meeting) => {
                    const partner = getMeetingPartner(meeting);
                    return (
                      <div
                        key={meeting.id}
                        className={`${styles.meetingCard} ${styles.activeNow} ${styles.compact}`}
                      >
                        <div className={styles.meetingHeader}>
                          <h3>Meeting with {partner?.firstName} {partner?.lastName}</h3>
                        </div>
                        <div className={styles.meetingDetails}>
                          <div className={styles.detailRow}>
                            <span className={styles.label}>Time:</span>
                            <span className={styles.value}>
                              {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
                            </span>
                          </div>
                        </div>
                        <div className={styles.meetingActions}>
                          <button
                            className={styles.joinButton}
                            onClick={() => handleJoinMeeting(meeting.id)}
                          >
                            Join Now
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {activeMeetings.length > 3 && (
                    <button
                      className={styles.viewAllButton}
                      onClick={() => setActiveTab('active')}
                    >
                      View All Active Meetings ({activeMeetings.length})
                    </button>
                  )}
                </div>
              </div>
            )}

            {upcomingMeetingsPreview.length > 0 && (
              <div className={styles.overviewGroup}>
                <h2 className={styles.overviewGroupTitle}>
                  📅 Upcoming Meetings ({upcomingMeetings.length})
                </h2>
                <div className={styles.overviewList}>
                  {upcomingMeetingsPreview.map((meeting) => {
                    const partner = getMeetingPartner(meeting);
                    const isSoon = isMeetingUpcomingSoon(meeting);
                    return (
                      <div
                        key={meeting.id}
                        className={`${styles.meetingCard} ${isSoon ? styles.soon : ''} ${styles.compact}`}
                      >
                        {isSoon && (
                          <div className={styles.soonBadge}>Coming Soon</div>
                        )}
                        <div className={styles.meetingHeader}>
                          <h3>Meeting with {partner?.firstName} {partner?.lastName}</h3>
                        </div>
                        <div className={styles.meetingDetails}>
                          <div className={styles.detailRow}>
                            <span className={styles.label}>Date:</span>
                            <span className={styles.value}>{formatDate(meeting.startTime)}</span>
                          </div>
                          <div className={styles.detailRow}>
                            <span className={styles.label}>Time:</span>
                            <span className={styles.value}>
                              {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
                            </span>
                          </div>
                        </div>
                        <div className={styles.meetingActions}>
                          <button
                            className={styles.joinButton}
                            onClick={() => handleJoinMeeting(meeting.id)}
                          >
                            Join Meeting
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {upcomingMeetings.length > 5 && (
                    <button
                      className={styles.viewAllButton}
                      onClick={() => setActiveTab('meetings')}
                    >
                      View All Upcoming Meetings ({upcomingMeetings.length})
                    </button>
                  )}
                </div>
              </div>
            )}

            {unreadNotifications.length > 0 && (
              <div className={styles.overviewGroup}>
                <h2 className={styles.overviewGroupTitle}>
                  🔔 Unread Notifications ({unreadCount})
                </h2>
                <div className={styles.overviewList}>
                  {unreadNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`${styles.notificationCard} ${styles.unread} ${styles.compact}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className={styles.notificationContent}>
                        <h4 className={styles.notificationTitle}>{notification.title}</h4>
                        <p className={styles.notificationMessage}>{notification.message}</p>
                        <span className={styles.timestamp}>
                          {formatDate(notification.createdAt)}
                        </span>
                      </div>
                      <div className={styles.notificationActions}>
                        <button
                          className={styles.markReadButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification.id);
                          }}
                          title="Mark as read"
                        >
                          ✓
                        </button>
                      </div>
                    </div>
                  ))}
                  {unreadCount > 5 && (
                    <button
                      className={styles.viewAllButton}
                      onClick={() => setActiveTab('system')}
                    >
                      View All Notifications ({systemNotifications.length})
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeMeetings.length === 0 && 
             upcomingMeetings.length === 0 && 
             unreadCount === 0 && (
              <div className={styles.empty}>
                <p>No new notifications</p>
                <p className={styles.emptySubtext}>
                  All caught up! Check back later for updates.
                </p>
              </div>
            )}
          </div>
        ) : activeTab === 'active' ? (
          <div className={styles.meetingsSection}>
            {error && <div className={styles.error}>{error}</div>}
            
            {activeMeetings.length === 0 ? (
              <div className={styles.empty}>
                <p>No active meetings right now</p>
                <p className={styles.emptySubtext}>
                  Active meetings will appear here when they start
                </p>
              </div>
            ) : (
              <div className={styles.meetingsList}>
                {activeMeetings.map((meeting) => {
                  const partner = getMeetingPartner(meeting);
                  
                  return (
                    <div
                      key={meeting.id}
                      className={`${styles.meetingCard} ${styles.activeNow}`}
                    >
                      <div className={styles.liveBadge}>🔴 Active Now</div>
                      
                      <div className={styles.meetingHeader}>
                        <h3>Meeting with {partner?.firstName} {partner?.lastName}</h3>
                        {partner?.username && (
                          <span className={styles.username}>@{partner.username}</span>
                        )}
                      </div>

                      <div className={styles.meetingDetails}>
                        <div className={styles.detailRow}>
                          <span className={styles.label}>📅 Date:</span>
                          <span className={styles.value}>{formatDate(meeting.startTime)}</span>
                        </div>
                        <div className={styles.detailRow}>
                          <span className={styles.label}>🕐 Time:</span>
                          <span className={styles.value}>
                            {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
                          </span>
                        </div>
                        <div className={styles.detailRow}>
                          <span className={styles.label}>📍 Status:</span>
                          <span className={styles.value}>
                            {user?.id === meeting.host?.id ? 'Host' : 'Guest'}
                          </span>
                        </div>
                      </div>

                      <div className={styles.meetingActions}>
                        <button
                          className={styles.joinButton}
                          onClick={() => handleJoinMeeting(meeting.id)}
                        >
                          Join Now
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : activeTab === 'meetings' ? (
          <div className={styles.meetingsSection}>
            {error && <div className={styles.error}>{error}</div>}
            
            {sortedMeetings.length === 0 ? (
              <div className={styles.empty}>
                <p>You have no upcoming meetings</p>
                <p className={styles.emptySubtext}>
                  Upcoming meetings will appear here so you can stay updated and see all the important information
                </p>
              </div>
            ) : (
              <div className={styles.meetingsList}>
                {sortedMeetings.map((meeting) => {
                  const partner = getMeetingPartner(meeting);
                  const isSoon = isMeetingUpcomingSoon(meeting);
                  
                  return (
                    <div
                      key={meeting.id}
                      className={`${styles.meetingCard} ${isSoon ? styles.soon : ''}`}
                    >
                      {isSoon && (
                        <div className={styles.soonBadge}>Coming Soon</div>
                      )}
                      
                      <div className={styles.meetingHeader}>
                        <h3>Meeting with {partner?.firstName} {partner?.lastName}</h3>
                        {partner?.username && (
                          <span className={styles.username}>@{partner.username}</span>
                        )}
                      </div>

                      <div className={styles.meetingDetails}>
                        <div className={styles.detailRow}>
                          <span className={styles.label}>📅 Date:</span>
                          <span className={styles.value}>{formatDate(meeting.startTime)}</span>
                        </div>
                        <div className={styles.detailRow}>
                          <span className={styles.label}>🕐 Time:</span>
                          <span className={styles.value}>
                            {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
                          </span>
                        </div>
                        <div className={styles.detailRow}>
                          <span className={styles.label}>📍 Status:</span>
                          <span className={styles.value}>
                            {user?.id === meeting.host?.id ? 'Host' : 'Guest'}
                          </span>
                        </div>
                      </div>

                      <div className={styles.meetingActions}>
                        <button
                          className={styles.joinButton}
                          onClick={() => handleJoinMeeting(meeting.id)}
                        >
                          Join Meeting
                        </button>
                        <button
                          className={styles.cancelButton}
                          onClick={() => handleCancelMeeting(meeting.id)}
                        >
                          Cancel Meeting
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : activeTab === 'system' ? (
          <div className={styles.systemSection}>
            {systemNotifications.length === 0 ? (
              <div className={styles.empty}>
                <p>No new notifications</p>
                <p className={styles.emptySubtext}>
                  System notifications will appear here
                </p>
              </div>
            ) : (
              <>
                <div className={styles.systemHeader}>
                  <button
                    className={styles.markAllReadButton}
                    onClick={handleMarkAllAsRead}
                    disabled={markAllLoading || unreadCount <= 0}
                    aria-busy={markAllLoading}
                  >
                    {markAllLoading ? 'Marking…' : 'Mark All as Read'}
                  </button>
                </div>
                <div className={styles.systemList}>
                  {systemNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`${styles.notificationCard} ${!notification.isRead ? styles.unread : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className={styles.notificationContent}>
                        <h4 className={styles.notificationTitle}>{notification.title}</h4>
                        <p className={styles.notificationMessage}>{notification.message}</p>
                        {notification.type && (
                          <span className={styles.notificationType}>{notification.type}</span>
                        )}
                        <span className={styles.timestamp}>
                          {formatDate(notification.createdAt)}
                        </span>
                      </div>
                      <div className={styles.notificationActions}>
                        {!notification.isRead && (
                          <button
                            className={styles.markReadButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification.id);
                            }}
                            title="Mark as read"
                          >
                            ✓
                          </button>
                        )}
                        <button
                          className={styles.deleteButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNotification(notification.id);
                          }}
                          title="Delete notification"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className={styles.alertsSection}>
            {loadingSubscriptions ? (
              <div className={styles.loading}>Loading subscriptions...</div>
            ) : subscriptions.length === 0 ? (
              <div className={styles.empty}>
                <p>You have no alert subscriptions</p>
                <p className={styles.emptySubtext}>
                  Manage your email alert subscriptions here. Subscribe to receive notifications when users add new availability slots.
                </p>
              </div>
            ) : (
              <div className={styles.subscriptionsList}>
                {subscriptions.map((subscription) => {
                  const targetUser = subscription.targetUser;
                  const displayName = targetUser 
                    ? `${targetUser.firstName || ''} ${targetUser.lastName || ''}`.trim() || targetUser.username || 'Unknown User'
                    : 'Unknown User';
                  
                  return (
                    <div
                      key={subscription.id}
                      className={`${styles.subscriptionCard} ${!subscription.active ? styles.inactive : ''}`}
                    >
                      <div className={styles.subscriptionContent}>
                        <div className={styles.subscriptionHeader}>
                          <h4 className={styles.subscriptionName}>{displayName}</h4>
                          {targetUser?.username && (
                            <span className={styles.username}>@{targetUser.username}</span>
                          )}
                        </div>
                        <div className={styles.subscriptionDetails}>
                          <div className={styles.detailRow}>
                            <span className={styles.label}>Status:</span>
                            <span className={`${styles.value} ${subscription.active ? styles.active : styles.inactive}`}>
                              {subscription.active ? '✓ Active' : '✗ Inactive'}
                            </span>
                          </div>
                          <div className={styles.detailRow}>
                            <span className={styles.label}>Subscribed:</span>
                            <span className={styles.value}>{formatDate(subscription.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className={styles.subscriptionActions}>
                        {subscription.active && (
                          <button
                            className={styles.unsubscribeButton}
                            onClick={() => handleUnsubscribe(subscription.targetUserId)}
                            title="Unsubscribe from email alerts"
                          >
                            Unsubscribe
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
