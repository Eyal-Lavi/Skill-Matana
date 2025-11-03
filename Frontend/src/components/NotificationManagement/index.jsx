import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AdminAPI from '../../features/admin/adminAPI';
import { fetchUsers } from '../../features/admin/adminThunks';
import TabNavigation from './TabNavigation';
import ViewNotificationsSection from './ViewNotificationsSection';
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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (name === 'sendToAll' && checked) {
      setFormData(prev => ({ ...prev, userId: '' }));
    }
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

  const CreateNotificationSection = () => (
    <form onSubmit={handleSubmit} className={styles.form}>
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {success && (
          <div className={styles.successMessage}>
            {success}
          </div>
        )}

        <div className={styles.formGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="sendToAll"
              checked={formData.sendToAll}
              onChange={handleInputChange}
            />
            <span>Send to all users</span>
          </label>
        </div>

        {!formData.sendToAll && (
          <div className={styles.formGroup}>
            <label htmlFor="userId">Select User *</label>
            <select
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleInputChange}
              required={!formData.sendToAll}
              className={styles.select}
            >
              <option value="">Choose a user...</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName} (@{user.username}) - {user.email}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="type">Type *</label>
          <input
            type="text"
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            placeholder="e.g., announcement, alert, update"
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Notification title"
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="message">Message *</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Notification message content"
            required
            rows={5}
            className={styles.textarea}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="link">Link (Optional)</label>
          <input
            type="text"
            id="link"
            name="link"
            value={formData.link}
            onChange={handleInputChange}
            placeholder="e.g., /dashboard/settings, /profile"
            className={styles.input}
          />
          <small className={styles.helpText}>
            Relative path where users will be redirected when clicking the notification
          </small>
        </div>

        <div className={styles.formActions}>
          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? 'Creating...' : formData.sendToAll ? 'Send to All Users' : 'Send Notification'}
          </button>
        </div>
      </form>
  );

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
        {activeTab === 'create' && <CreateNotificationSection />}
        {activeTab === 'view' && <ViewNotificationsSection />}
      </div>
    </div>
  );
};

export default NotificationManagement;

