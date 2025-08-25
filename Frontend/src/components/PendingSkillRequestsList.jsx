import React from 'react'
import { useDispatch ,useSelector} from 'react-redux';
import { selectAdminError ,
         selectAdminLoading , 
         selectPendingSkillRequests} from '../features/admin/adminSelectors';
import { updateSkillRequestStatus } from '../features/admin/adminThunks';

function PendingSkillRequestsList() {
    const requests = useSelector(selectPendingSkillRequests);
    const loading = useSelector(selectAdminLoading);
    const error = useSelector(selectAdminError);
    const dispatch = useDispatch();

    const handelClick = async(requestId , status) => {
        if((status !== 'rejected' && status !== 'approved') || !requestId){
            console.error('invalid request');
            return;
        }
        dispatch(updateSkillRequestStatus({requestId , status}));
    }
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
            <button onClick={() => {handelClick(request.id , 'rejected')}}>reject</button>
            <button onClick={() => {handelClick(request.id ,'approved')}}>approve</button>
            </li>
        ))}
    </ul>
  )
}

export default PendingSkillRequestsList