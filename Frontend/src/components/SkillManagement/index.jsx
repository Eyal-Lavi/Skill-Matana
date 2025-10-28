import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  selectAdminError,
  selectAdminLoading,
  selectPendingSkillRequests 
} from '../../features/admin/adminSelectors';
import { fetchPendingSkillRequests } from '../../features/admin/adminThunks';
import { useInfiniteScroll } from '../../hooks';
import { useSkillsData } from './hooks/useSkillsData';
import { useSkillActions } from './hooks/useSkillActions';
import TabNavigation from './TabNavigation';
import ExistingSkillsSection from './ExistingSkillsSection';
import PendingRequestsSection from './PendingRequestsSection';
import AddSkillModal from './AddSkillModal/AddSkillModal.jsx';
import styles from './SkillManagement.module.scss';

const SkillManagement = () => {
  const [activeTab, setActiveTab] = useState('existing');
  const [isModalOpen, setIsModalOpen] = useState(false);

  
  const {
    skills,
    loading,
    error,
    pagination,
    isLoadingMore,
    filters,
    fetchSkills,
    handleFilterChange,
    handleSearchChange,
    handleSortChange,
    handleClearFilters,
    loadMore
  } = useSkillsData();

  const { handleSkillStatusChange, handleAddSkill } = useSkillActions(() => 
    fetchSkills(true)
  );


  const pendingRequests = useSelector(selectPendingSkillRequests);
  const pendingLoading = useSelector(selectAdminLoading);
  const pendingError = useSelector(selectAdminError);


  useEffect(() => {
    fetchPendingSkillRequests();
    fetchSkills(true);
  }, []);


  const lastElementRef = useInfiniteScroll(loadMore, pagination.hasMore, isLoadingMore);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleAddSkillClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleAddSkillSubmit = async (skillName) => {
    try {
      await handleAddSkill(skillName);
      setIsModalOpen(false);
    } catch (err) {
      throw err;
    }
  };

  const handleRefreshPending = () => {
    fetchPendingSkillRequests();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Skill Management</h1>
        <p>Manage existing skills and pending requests</p>
      </div>

      <TabNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        existingCount={pagination.total}
        pendingCount={pendingRequests.length}
      />

      <div className={styles.content}>
        {activeTab === 'existing' && (
          <ExistingSkillsSection
            skills={skills}
            filters={filters}
            pagination={pagination}
            loading={loading}
            error={error}
            isLoadingMore={isLoadingMore}
            lastElementRef={lastElementRef}
            onFilterChange={handleFilterChange}
            onSearchChange={handleSearchChange}
            onSortChange={handleSortChange}
            onClearFilters={handleClearFilters}
            onStatusChange={handleSkillStatusChange}
            onAddSkill={handleAddSkillClick}
          />
        )}

        {activeTab === 'pending' && (
          <PendingRequestsSection
            pendingLoading={pendingLoading}
            pendingError={pendingError}
            onRefresh={handleRefreshPending}
          />
        )}
      </div>

      <AddSkillModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onAddSkill={handleAddSkillSubmit}
      />
    </div>
  );
};

export default SkillManagement;
