import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AdminAPI from '../../features/admin/adminAPI';
import { fetchUsers } from '../../features/admin/adminThunks';
import TabNavigation from './TabNavigation';
import ViewNotificationsSection from './ViewNotificationsSection';
import CreateNotificationSection from './CreateNotificationSection';
import styles from './NotificationManagement.module.scss';

const NotificationManagement = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('create');
  const [statsCount, setStatsCount] = useState(0);
  
  const [formData, setFormData] = useState({
    userId: '',
    sendToAll: false,
    type: '',
    title: '',
    message: '',
    link: ''
  });

  useEffect(() => {
    loadUsers();
    loadStatsCount();
  }, []);

  const loadStatsCount = async () => {
    try {
      const response = await AdminAPI.getNotificationGroupedStats();
      setStatsCount(response.data?.length || 0);
    } catch (err) {
      console.error('Failed to load stats count:', err);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await dispatch(fetchUsers({ page: 1, limit: 100, search: '', status: null })).unwrap();
      setUsers(response.users || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    // Single state update to avoid double re-renders while typing
    setFormData(prev => {
      const next = {
        ...prev,
        [name]: inputType === 'checkbox' ? checked : value
      };
      if (name === 'sendToAll' && checked) {
        next.userId = '';
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const notificationData = {
        sendToAll: formData.sendToAll,
        type: formData.type,
        title: formData.title,
        message: formData.message,
        link: formData.link || null
      };

      if (!formData.sendToAll) {
        if (!formData.userId) {
          throw new Error('Please select a user or choose to send to all users');
        }
        notificationData.userId = parseInt(formData.userId);
      }

      await AdminAPI.createNotification(notificationData);
      
      setSuccess(formData.sendToAll 
        ? 'Notifications created successfully for all users!'
        : 'Notification created successfully!'
      );
      
      // Reset form
      setFormData({
        userId: '',
        sendToAll: false,
        type: '',
        title: '',
        message: '',
        link: ''
      });

      // Refresh stats count
      await loadStatsCount();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Notification Management</h1>
        <p>Create and send system notifications to users</p>
      </div>

      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        viewCount={statsCount}
      />

      <div className={styles.content}>
        {activeTab === 'create' && (
          <CreateNotificationSection
            error={error}
            success={success}
            formData={formData}
            users={users}
            loading={loading}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        )}
        {activeTab === 'view' && <ViewNotificationsSection />}
      </div>
    </div>
  );
};

export default NotificationManagement;

