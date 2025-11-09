import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import notificationsAPI from '../../services/notificationsAPI';
import { useNotifications } from '../../contexts/NotificationsContext';
import style from "./NotificationsPreview.module.scss";

export default function NotificationsPreview() {
  const user = useSelector((s) => s.auth?.user);
  const navigate = useNavigate();
  const { unreadCount, refreshUnreadCount } = useNotifications();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadNotifications();
    }
  }, [user?.id]);

  const loadNotifications = async () => {
    try {
      const response = await notificationsAPI.getAll({ 
        isRead: false, 
        limit: 5 
      });
      const data = response?.data || [];
      setNotifications(data);
    } catch (err) {
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = (notification) => {
    if (notification.link) {
      navigate(notification.link);
    } else {
      navigate('/dashboard/notifications');
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className={style.notificationsPreview}>
        <h2>Notifications</h2>
        <div className={style.loading}>Loading...</div>
      </div>
    );
  }

  if (unreadCount === 0) {
    return (
      <div className={style.notificationsPreview}>
        <h2>Notifications</h2>
        <div className={style.empty}>
          <p>No unread notifications</p>
          <p className={style.emptySubtext}>
            You're all caught up!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={style.notificationsPreview}>
      <div className={style.header}>
        <h2>Notifications</h2>
        <div className={style.badge}>{unreadCount}</div>
        {notifications.length > 0 && (
          <button 
            className={style.viewAllButton}
            onClick={() => navigate('/dashboard/notifications')}
          >
            View All
          </button>
        )}
      </div>
      
      <div className={style.notificationsList}>
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={style.notificationCard}
            onClick={() => handleNotificationClick(notification)}
          >
            <div className={style.notificationIcon}>
              {notification.type === 'info' && 'ℹ️'}
              {notification.type === 'success' && '✅'}
              {notification.type === 'warning' && '⚠️'}
              {notification.type === 'error' && '❌'}
              {!['info', 'success', 'warning', 'error'].includes(notification.type) && '🔔'}
            </div>
            <div className={style.notificationContent}>
              <h3>{notification.title}</h3>
              <p>{notification.message}</p>
              <span className={style.notificationTime}>
                {formatTime(notification.createdAt)}
              </span>
            </div>
            <div className={style.notificationArrow}>→</div>
          </div>
        ))}
      </div>
    </div>
  );
}

