import axios from 'axios';
const VITE_API_URL = import.meta.env.VITE_API_URL;
const API_BASE_URL = VITE_API_URL + '/admin/skill-requests/pending';

const AdminAPI = {
    getPendingSkillRequests:async() => {
        try{
            const response = await axios.get(`${API_BASE_URL}` , {withCredentials:true});
            return response.data;
        }catch(error){
            console.error(error.message);
            throw error;
        }
        
    }
}
export default AdminAPI;