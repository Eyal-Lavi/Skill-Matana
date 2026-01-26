import axios from 'axios';
const VITE_API_URL = import.meta.env.VITE_API_URL;
const API_BASE_URL = VITE_API_URL + '/admin';

const AdminAPI = {
    getPendingSkillRequests:async() => {
        const response = await axios.get(`${API_BASE_URL}/skill-requests/pending` , {withCredentials:true});
        return response.data;
    },
    updateSkillRequestStatus: async(requestId ,status)=> {
        const response = await axios.post(`${API_BASE_URL}/skill-requests/status` ,
            {requestId , status} ,
            {withCredentials:true}
        );
        return response.data;
    },
    updateSkillStatus: async(skillId, status) => {
        const response = await axios.put(`${API_BASE_URL}/skills/status` ,
            {skillId, status} ,
            {withCredentials:true}
        );
        return response.data;
    },
    getAllUsers: async(page = 1, limit = 10, search = '', status = null) => {
        const response = await axios.get(`${API_BASE_URL}/users`, {
            params: { page, limit, search, status },
            withCredentials: true
        });
        return response.data;
    },
    updateUserStatus: async(userId, status) => {
        const response = await axios.put(`${API_BASE_URL}/users/status`, 
            { userId, status },
            { withCredentials: true }
        );
        return response.data;
    },
    updateUser: async(userData) => {
        const response = await axios.put(`${API_BASE_URL}/users`, 
            userData,
            { withCredentials: true }
        );
        return response.data;
    },
    loginAsUser: async(userId) => {
        const response = await axios.post(`${API_BASE_URL}/users/login-as`, 
            { userId },
            { withCredentials: true }
        );
        return response.data;
    },
    createNotification: async(notificationData) => {
        const response = await axios.post(`${API_BASE_URL}/notifications`, 
            notificationData,
            { withCredentials: true }
        );
        return response.data;
    },
    getAllNotifications: async(page = 1, limit = 20, search = '', type = null) => {
        const response = await axios.get(`${API_BASE_URL}/notifications`, {
            params: { page, limit, search, type },
            withCredentials: true
        });
        return response.data;
    },
    getNotificationGroupedStats: async() => {
        const response = await axios.get(`${API_BASE_URL}/notifications/stats`, {
            withCredentials: true
        });
        return response.data;
    },
    getNotificationDetails: async(type, title, message, link = null) => {
        const response = await axios.get(`${API_BASE_URL}/notifications/details`, {
            params: { type, title, message, link },
            withCredentials: true
        });
        return response.data;
    },
    deleteSystemNotifications: async(type, title, message, link = null) => {
        const response = await axios.delete(`${API_BASE_URL}/notifications`, {
            data: { type, title, message, link },
            withCredentials: true
        });
        return response.data;
    },
    getOverviewStats: async() => {
        const response = await axios.get(`${API_BASE_URL}/overview`, {
            withCredentials: true
        });
        return response.data;
    }
}
export default AdminAPI;