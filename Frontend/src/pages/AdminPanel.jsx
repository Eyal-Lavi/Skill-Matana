import {useDispatch} from 'react-redux';
import { fetchPendingSkillRequests } from '../features/admin/adminThunks';
import PendingSkillRequestsList from '../components/PendingSkillRequestsList';
import { useState } from 'react';
const AdminPanel = () => {
  const dispatch = useDispatch();
  const [isCliked , setIsCliked] = useState(false);
  const handleClick = () => {
    setIsCliked(true);
    dispatch(fetchPendingSkillRequests());

  }
   return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      <p>Welcome to the admin panel. Here you can manage users, settings, and more.</p>
      <button onClick={handleClick}>fetch pending skill requests</button>
      {isCliked &&<PendingSkillRequestsList/>}
    </div>
  );
}

export default AdminPanel;