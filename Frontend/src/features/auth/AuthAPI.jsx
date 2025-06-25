import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; 

const authAPI = {
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials, {
        withCredentials: true
      });
  
      return response.data; 
    } catch (error) {
      console.error('Login error:', error.response?.data?.message || error.message);
      console.log(error.response.data.message);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData , {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Register error:', error.response?.data || error.message);
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/logout`, null, {withCredentials: true});
      console.log('response');
      console.log(response);
      
      return response?.data?.message || response; 
    } catch (error) {
      console.error('Logout error:', error.response?.data?.message || error.message);
      throw error;
    }
  },

  checkSession: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/session`, { withCredentials: true });
      return response.data; 
    } catch (error) {
      console.error('Session check error:', error.response?.data?.message || error.message);
      throw error;
    }
  }

};

export default authAPI;