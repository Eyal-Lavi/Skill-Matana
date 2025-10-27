import axios from 'axios';

const VITE_API_URL = import.meta.env.VITE_API_URL;
const API_BASE_URL = VITE_API_URL + '/meetings';

const meetingsAPI = {
  getMyMeetings: async (status = 'scheduled') => {
    try {
      const response = await axios.get(`${API_BASE_URL}/my?status=${status}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch meetings:', error.response?.data || error.message);
      throw error;
    }
  },

  cancelMeeting: async (meetingId) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/${meetingId}/cancel`, {}, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Failed to cancel meeting:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default meetingsAPI;
