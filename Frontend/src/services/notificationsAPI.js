import axios from 'axios';

const VITE_API_URL = import.meta.env.VITE_API_URL;
const API_BASE_URL = VITE_API_URL + '/notifications';

const notificationsAPI = {
  getAll: async (options = {}) => {
    try {
      const params = new URLSearchParams();
      if (options.isRead !== undefined) {
        params.append('isRead', options.isRead);
      }
      if (options.limit) {
        params.append('limit', options.limit);
      }
      if (options.offset) {
        params.append('offset', options.offset);
      }

      const response = await axios.get(`${API_BASE_URL}?${params.toString()}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch notifications:', error.response?.data || error.message);
      throw error;
    }
  },

  getUnreadCount: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/unread-count`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch unread count:', error.response?.data || error.message);
      throw error;
    }
  },

  markAsRead: async (notificationId) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/${notificationId}/read`, {}, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Failed to mark notification as read:', error.response?.data || error.message);
      throw error;
    }
  },

  markAllAsRead: async () => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/mark-all-read`, {}, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error.response?.data || error.message);
      throw error;
    }
  },

  delete: async (notificationId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${notificationId}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Failed to delete notification:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default notificationsAPI;

