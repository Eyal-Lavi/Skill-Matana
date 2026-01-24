import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  selectUsers,
  selectUsersLoading,
  selectUsersError,
  selectUsersPagination
} from '../../features/admin/adminSelectors';
import { fetchUsers, updateUserStatus, updateUser, loginAsUser } from '../../features/admin/adminThunks';
import { authActions } from '../../features/auth/AuthSlices';
import authAPI from '../../features/auth/AuthAPI';
import styles from './UserManagement.module.scss';
import useDebounce from '../../hooks/useDebounce';
import EditUserModal from './EditUserModal';
import { useToast } from '../../contexts/ToastContext';

const UserManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const users = useSelector(selectUsers);
  const loading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);
  const pagination = useSelector(selectUsersPagination);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        await dispatch(fetchUsers({
          page: currentPage,
          limit: 10,
          search: debouncedSearch,
          status: statusFilter || null
        })).unwrap();
      } catch (err) {
        console.error('Failed to load users:', err);
      }
    };
    
    loadUsers();
  }, [dispatch, currentPage, debouncedSearch, statusFilter]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    try {
      await dispatch(updateUserStatus({ userId, status: newStatus })).unwrap();
    } catch (err) {
      console.error('Failed to update user status:', err);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  const handleSaveUser = async (userData) => {
    await dispatch(updateUser(userData)).unwrap();
    // Refresh users list
    await dispatch(
      fetchUsers({
        page: currentPage,
        limit: 10,
        search: debouncedSearch,
        status: statusFilter || null,
      })
    ).unwrap();
    handleEditModalClose();
  };

  const handleLoginAsUser = async (userId) => {
    try {
      // Login as the selected user
      await dispatch(loginAsUser(userId)).unwrap();
      
      // Refresh session to get updated user data
      const sessionData = await authAPI.checkSession();
      
      if (sessionData.isAuthenticated && sessionData.user) {
        // Update Redux store with new user
        dispatch(authActions.updateFromSession(sessionData.user));
        
        // Navigate to dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Failed to login as user:', err);
      toast.error(err || 'Failed to login as user');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>User Management</h1>
        <p>Manage users and their status</p>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filterContainer}>
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className={styles.statusSelect}
          >
            <option value="">All Status</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : users.length === 0 ? (
          <div className={styles.empty}>No users found</div>
        ) : (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Gender</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.gender}</td>
                    <td>
                      <span className={user.status === 1 ? styles.activeStatus : styles.inactiveStatus}>
                        {user.status === 1 ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionsContainer}>
                        <button
                          onClick={() => handleEditClick(user)}
                          className={styles.editBtn}
                          title="Edit User"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleLoginAsUser(user.id)}
                          className={styles.loginAsBtn}
                          title="Login As This User"
                        >
                          Login As
                        </button>
                        <button
                          onClick={() => handleStatusToggle(user.id, user.status)}
                          className={user.status === 1 ? styles.deactivateBtn : styles.activateBtn}
                        >
                          {user.status === 1 ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles.pagination}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className={styles.pageBtn}
              >
                Previous
              </button>
              <span className={styles.pageInfo}>
                Page {currentPage} of {pagination.pages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.pages || loading}
                className={styles.pageBtn}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        user={editingUser}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default UserManagement;

