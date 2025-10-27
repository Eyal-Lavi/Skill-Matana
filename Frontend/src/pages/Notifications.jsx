import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import meetingsAPI from '../services/meetingsAPI';
import styles from './Notifications.module.scss';

export default function Notifications() {
  const user = useSelector((s) => s.auth?.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [activeMeetings, setActiveMeetings] = useState([]);
  const [systemNotifications, setSystemNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('active');
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      loadMeetings();
      loadSystemNotifications();
    }
    
    // Update active meetings every minute
    const interval = setInterval(() => {
      if (user?.id) {
        loadMeetings();
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
      
      // Filter active and upcoming meetings
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
      setError(err.message || 'שגיאה בטעינת הפגישות');
    } finally {
      setLoading(false);
    }
  };

  const loadSystemNotifications = () => {
    // TODO: Implement when system notifications are ready
    setSystemNotifications([]);
  };

  const handleCancelMeeting = async (meetingId) => {
    if (!window.confirm('האם אתה בטוח שברצונך לבטל את הפגישה?')) {
      return;
    }

    try {
      await meetingsAPI.cancelMeeting(meetingId);
      await loadMeetings();
    } catch (err) {
      alert(err.message || 'שגיאה בביטול הפגישה');
    }
  };

  const handleJoinMeeting = (meetingId) => {
    navigate(`/meeting/${meetingId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('he-IL', {
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
        <h1>התראות</h1>
        <p>עדכונים על פגישות עתידיות והתראות מהמערכת</p>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'active' ? styles.active : ''}`}
          onClick={() => setActiveTab('active')}
        >
          פעיל כעת
          {activeMeetings.length > 0 && (
            <span className={styles.badge}>{activeMeetings.length}</span>
          )}
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'meetings' ? styles.active : ''}`}
          onClick={() => setActiveTab('meetings')}
        >
          פגישות עתידיות
          {upcomingMeetings.length > 0 && (
            <span className={styles.badge}>{upcomingMeetings.length}</span>
          )}
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'system' ? styles.active : ''}`}
          onClick={() => setActiveTab('system')}
        >
          התראות מערכת
          {systemNotifications.length > 0 && (
            <span className={styles.badge}>{systemNotifications.length}</span>
          )}
        </button>
      </div>

      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>טוען...</div>
        ) : activeTab === 'active' ? (
          <div className={styles.meetingsSection}>
            {error && <div className={styles.error}>{error}</div>}
            
            {activeMeetings.length === 0 ? (
              <div className={styles.empty}>
                <p>אין פגישות פעילות כרגע</p>
                <p className={styles.emptySubtext}>
                  פגישות פעילות יופיעו כאן כשהן מתחילות
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
                      <div className={styles.liveBadge}>🔴 פעיל כעת</div>
                      
                      <div className={styles.meetingHeader}>
                        <h3>פגישה עם {partner?.firstName} {partner?.lastName}</h3>
                        {partner?.username && (
                          <span className={styles.username}>@{partner.username}</span>
                        )}
                      </div>

                      <div className={styles.meetingDetails}>
                        <div className={styles.detailRow}>
                          <span className={styles.label}>📅 תאריך:</span>
                          <span className={styles.value}>{formatDate(meeting.startTime)}</span>
                        </div>
                        <div className={styles.detailRow}>
                          <span className={styles.label}>🕐 זמן:</span>
                          <span className={styles.value}>
                            {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
                          </span>
                        </div>
                        <div className={styles.detailRow}>
                          <span className={styles.label}>📍 סטטוס:</span>
                          <span className={styles.value}>
                            {user?.id === meeting.host?.id ? 'מארח' : 'אורח'}
                          </span>
                        </div>
                      </div>

                      <div className={styles.meetingActions}>
                        <button
                          className={styles.joinButton}
                          onClick={() => handleJoinMeeting(meeting.id)}
                        >
                          להצטרף עכשיו
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
                <p>אין לך פגישות עתידיות</p>
                <p className={styles.emptySubtext}>
                  פגישות עתידיות יופיעו כאן כדי שתוכל להתעדכן ולראות את כל המידע החשוב
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
                        <div className={styles.soonBadge}>מתקרב</div>
                      )}
                      
                      <div className={styles.meetingHeader}>
                        <h3>פגישה עם {partner?.firstName} {partner?.lastName}</h3>
                        {partner?.username && (
                          <span className={styles.username}>@{partner.username}</span>
                        )}
                      </div>

                      <div className={styles.meetingDetails}>
                        <div className={styles.detailRow}>
                          <span className={styles.label}>📅 תאריך:</span>
                          <span className={styles.value}>{formatDate(meeting.startTime)}</span>
                        </div>
                        <div className={styles.detailRow}>
                          <span className={styles.label}>🕐 זמן:</span>
                          <span className={styles.value}>
                            {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
                          </span>
                        </div>
                        <div className={styles.detailRow}>
                          <span className={styles.label}>📍 סטטוס:</span>
                          <span className={styles.value}>
                            {user?.id === meeting.host?.id ? 'מארח' : 'אורח'}
                          </span>
                        </div>
                      </div>

                      <div className={styles.meetingActions}>
                        <button
                          className={styles.joinButton}
                          onClick={() => handleJoinMeeting(meeting.id)}
                        >
                          להצטרף לפגישה
                        </button>
                        <button
                          className={styles.cancelButton}
                          onClick={() => handleCancelMeeting(meeting.id)}
                        >
                          בטל פגישה
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
                <p>אין התראות חדשות</p>
                <p className={styles.emptySubtext}>
                  התראות מהמערכת יופיעו כאן בעתיד
                </p>
              </div>
            ) : (
              <div className={styles.systemList}>
                {systemNotifications.map((notification, index) => (
                  <div key={index} className={styles.notificationCard}>
                    <p>{notification.message}</p>
                    <span className={styles.timestamp}>{notification.timestamp}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
