import React from 'react'
import { useSelector } from 'react-redux';
import { selectAdminError ,
         selectAdminLoading , 
         selectPendingSkillRequests} from '../features/admin/adminSelectors';

function PendingSkillRequestsList() {
    const requests = useSelector(selectPendingSkillRequests);
    const loading = useSelector(selectAdminLoading);
    const error = useSelector(selectAdminError);

    if(loading){
        return <p>Loading...</p>
    }
    if(error){
        return <p>{error}</p>
    }
    if(requests.length === 0){
        return <p>no requests found</p>
    }
  return (
    <ul>
        {requests.map(request => (
            <li key={request.id}><strong>{request.name}</strong>
            <button>reject</button>
            <button>aprove</button>
            </li>
        ))}
    </ul>
  )
}

export default PendingSkillRequestsList