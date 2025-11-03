import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import meetingsAPI from '../services/meetingsAPI';
import notificationsAPI from '../services/notificationsAPI';
import { useNotifications } from '../contexts/NotificationsContext';
import styles from './Notifications.module.scss';

export default function Notifications() {
  const user = useSelector((s) => s.auth?.user);
  const { refreshUnreadCount } = useNotifications();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [activeMeetings, setActiveMeetings] = useState([]);
  const [systemNotifications, setSystemNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState('active');
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      loadMeetings();
      loadSystemNotifications();
    }
    
  
    const interval = setInterval(() => {
      if (user?.id) {
        loadMeetings();
        loadSystemNotifications();
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

  const handleCancelMeeting = async (meetingId) => {
    if (!window.confirm('Are you sure you want to cancel the meeting?')) {
      return;
    }

    try {
      await meetingsAPI.cancelMeeting(meetingId);
      await loadMeetings();
    } catch (err) {
      alert(err.message || 'Error canceling meeting');
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
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      await loadSystemNotifications();
      // Refresh unread count immediately
      refreshUnreadCount();
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) {
      return;
    }
    try {
      await notificationsAPI.delete(notificationId);
      await loadSystemNotifications();
      // Refresh unread count immediately
      refreshUnreadCount();
    } catch (err) {
      console.error('Error deleting notification:', err);
      alert(err.response?.data?.message || 'Error deleting notification');
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
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

  return (
    <div className={styles.notificationsContainer}>
      <div className={styles.header}>
        <h1>Notifications</h1>
        <p>Updates on upcoming meetings and system notifications</p>
      </div>

      <div className={styles.tabs}>
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
      </div>

      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>Loading...</div>
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
        ) : (
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
                  >
                    Mark All as Read
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
        )}
      </div>
    </div>
  );
}
