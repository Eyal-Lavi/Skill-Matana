import AdminOverview from '../../components/admin/AdminOverview';
import style from './AdminPanel.module.scss';

const AdminPanel = () => {
  return (
    <div className={style.adminPanel}>
      <AdminOverview />
    </div>
  );
}

export default AdminPanel;