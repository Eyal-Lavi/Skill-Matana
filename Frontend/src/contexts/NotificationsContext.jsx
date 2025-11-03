import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import notificationsAPI from '../services/notificationsAPI';

const NotificationsContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationsProvider');
  }
  return context;
};

export const NotificationsProvider = ({ children }) => {
  const user = useSelector((s) => s.auth?.user);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadUnreadCount = useCallback(async () => {
    if (!user?.id) {
      setUnreadCount(0);
      return;
    }

    try {
      setLoading(true);
      const response = await notificationsAPI.getUnreadCount();
      setUnreadCount(response.count || 0);
    } catch (err) {
      console.error('Failed to load unread count:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const refreshUnreadCount = useCallback(() => {
    loadUnreadCount();
  }, [loadUnreadCount]);

  useEffect(() => {
    if (user?.id) {
      loadUnreadCount();
      
      // Refresh every 30 seconds
      const interval = setInterval(() => {
        loadUnreadCount();
      }, 30000);

      return () => clearInterval(interval);
    } else {
      setUnreadCount(0);
    }
  }, [user?.id, loadUnreadCount]);

  const value = {
    unreadCount,
    refreshUnreadCount,
    loading
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

