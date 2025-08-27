import React from 'react';
import styles from './SkillManagement.module.scss';

const FilterSummary = ({ filters, totalCount }) => {
  const hasActiveFilters = filters.search || filters.status !== null;
  
  if (!hasActiveFilters) return null;

  const getStatusText = (status) => {
    return status === 1 ? 'Active' : 'Inactive';
  };

  return (
    <div className={styles.filterSummary}>
      <span className={styles.summaryText}>
        Showing {totalCount} skills
        {filters.search && ` matching "${filters.search}"`}
        {filters.status !== null && ` with status ${getStatusText(filters.status)}`}
      </span>
    </div>
  );
};

export default FilterSummary;
