import axios from 'axios';
const VITE_API_URL = import.meta.env.VITE_API_URL;
const API_BASE_URL = VITE_API_URL + '/search';

const SearchAPI = {
    search: async (name,skillId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}`, { withCredentials: true ,params:{
                name,
                skillId
            } });
            return response.data;
        } catch (error) {
            console.error('Session check error:', error.response?.data?.message || error.message);
            throw error;
        }
    },
};

export default SearchAPI;