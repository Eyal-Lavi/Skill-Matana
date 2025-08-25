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
    }
}
export default AdminAPI;