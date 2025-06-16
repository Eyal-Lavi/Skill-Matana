import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; 

const authAPI = {
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
      return response.data; 
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      console.error('Register error:', error.response?.data || error.message);
      throw error;
    }
  },

  logout: async () => {
    await axios.post(`${API_BASE_URL}/auth/logout`);

    return true; // או תגובה מהשרת
  },

};

export default authAPI;