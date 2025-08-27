import {useDispatch} from 'react-redux';
import { fetchPendingSkillRequests } from '../features/admin/adminThunks';
import PendingSkillRequestsList from '../components/PendingSkillRequestsList';
import { useState } from 'react';
const AdminPanel = () => {
  const dispatch = useDispatch();
  const [isClicked , setIsClicked] = useState(false);
  const handleClick = () => {
    setIsClicked(true);
    dispatch(fetchPendingSkillRequests());

  }
   return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      <p>Welcome to the admin panel. Here you can manage users, settings, and more.</p>
      <button onClick={handleClick}>fetch pending skill requests</button>
      {isClicked &&<PendingSkillRequestsList/>}
    </div>
  );
}

export default AdminPanel;