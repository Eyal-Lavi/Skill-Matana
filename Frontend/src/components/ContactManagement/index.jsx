import React, { useState } from 'react';
import { useContactRequestsData } from './hooks/useContactRequestsData';
import { useConnectionsData } from './hooks/useConnectionsData';
import { useConnectionActions } from './hooks/useConnectionActions';
import ExistingConnectionsSection from './ExistingConnectionsSection';
import PendingRequestsSection from './PendingRequestsSection';
import TabNavigation from './TabNavigation';
import styles from './ContactManagement.module.scss';

const ContactManagement = () => {
  const [activeTab, setActiveTab] = useState('connections');

  // Contact requests data
  const { received, sent, loading: pendingLoading, error: pendingError, refresh } = useContactRequestsData();
  const { connections, total, filters, handleFilterChange, handleSearchChange, handleSortChange, handleClearFilters } = useConnectionsData();
  const { handleUpdateRequestStatus, handleCancelRequest } = useConnectionActions(refresh);

  const pendingReceived = (received || []).filter(r => r.status === 'pending');
  const pendingSent = (sent || []).filter(r => r.status === 'pending');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Contact Management</h1>
        <p>Manage your connections and pending requests</p>
      </div>

      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        existingCount={connections.length}
        pendingCount={pendingReceived.length + pendingSent.length}
      />

      <div className={styles.content}>
        {activeTab === 'connections' && (
          <ExistingConnectionsSection
            connections={connections}
            total={total}
            filters={filters}
            loading={false}
            error={''}
            onFilterChange={handleFilterChange}
            onSearchChange={handleSearchChange}
            onSortChange={handleSortChange}
            onClearFilters={handleClearFilters}
          />
        )}

        {activeTab === 'pending' && (
          <PendingRequestsSection
            pendingLoading={pendingLoading}
            pendingError={pendingError}
            onRefresh={refresh}
            received={pendingReceived}
            sent={pendingSent}
            onUpdateStatus={handleUpdateRequestStatus}
            onCancel={handleCancelRequest}
          />
        )}
      </div>
    </div>
  );
};

export default ContactManagement;
