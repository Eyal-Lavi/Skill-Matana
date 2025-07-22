import axios from 'axios';
const VITE_API_URL = import.meta.env.VITE_API_URL;
const API_BASE_URL = VITE_API_URL + '/meta-data';

const MetaDataAPI = {
    metaData: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}`, { withCredentials: true });
            return response.data;
        } catch (error) {
            console.error('Session check error:', error.response?.data?.message || error.message);
            throw error;
        }
    },
};

export default MetaDataAPI;