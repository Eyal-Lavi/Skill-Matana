import axios from 'axios';
const VITE_API_URL = import.meta.env.VITE_API_URL;
const API_BASE_URL = VITE_API_URL + '/auth'; 

const authAPI = {
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, credentials, {
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
      const response = await axios.post(`${API_BASE_URL}/register`, userData , {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Register error:', error.response?.data || error.message);
      throw error;
    }
  },
  updateProfile: async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/update-profile`, userData , { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('Update faild', error.response?.data || error.message);
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/logout`, null, {withCredentials: true});
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
      const response = await axios.get(`${API_BASE_URL}/session`, { withCredentials: true });
      return response.data; 
    } catch (error) {
      console.error('Session check error:', error.response?.data?.message || error.message);
      throw error;
    }
  },
  sendLinkReset: async(email) => {
    try{
      const response = await axios.post(`${API_BASE_URL}/reset-password` , {email} , {withCredentials:true});
      return response.data;
    }catch(error){
      console.error(error.response?.data?.message || error.message);
      throw error;
    }
  },
  checkToken: async(token) => {
    try{
      const response = await axios.get(`${API_BASE_URL}/check-token/${token}` , {withCredentials:true});
      return response.data;
    }catch(error){
      console.error(error.response?.data?.message || error.message);
      throw error;
    }
  },


};

export default authAPI;