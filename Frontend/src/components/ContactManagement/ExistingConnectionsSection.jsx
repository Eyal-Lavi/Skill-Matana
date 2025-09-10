import React from 'react';
import SectionHeader from './SectionHeader';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import EmptyState from './EmptyState';
import SkillFilters from '../SkillFilters';
import ConnectionsGrid from './ConnectionsGrid';
import styles from './ContactManagement.module.scss';

const ExistingConnectionsSection = ({
  connections,
  total,
  filters,
  loading,
  error,
  onFilterChange,
  onSearchChange,
  onSortChange,
  onClearFilters,
}) => {
  return (
    <div className={styles.existingSkills}>
      <SectionHeader title="Connections" />

      <SkillFilters
        filters={filters}
        onFilterChange={onFilterChange}
        onSearchChange={onSearchChange}
        onSortChange={onSortChange}
        onClearFilters={onClearFilters}
      />

      <div className={styles.filterSummary}>
        <span className={styles.summaryText}>Showing {total} connections</span>
      </div>

      {loading && <LoadingSpinner message="Loading connections..." />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && connections.length === 0 && (
        <EmptyState icon="📇" title="No Connections Found" hasFilters={!!filters.search} />
      )}

      {!loading && !error && connections.length > 0 && (
        <ConnectionsGrid connections={connections} />
      )}
    </div>
  );
};

export default ExistingConnectionsSection;
