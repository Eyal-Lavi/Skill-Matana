import React from 'react';
import SectionHeader from './SectionHeader';
import SkillFilters from '../SkillFilters';
import FilterSummary from './FilterSummary';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import EmptyState from './EmptyState';
import SkillsGrid from './SkillsGrid';
import styles from './SkillManagement.module.scss';

const ExistingSkillsSection = ({
  skills,
  filters,
  pagination,
  loading,
  error,
  isLoadingMore,
  lastElementRef,
  onFilterChange,
  onSearchChange,
  onSortChange,
  onClearFilters,
  onStatusChange,
  onAddSkill
}) => {
  const addButton = (
    <button 
      className={styles.addButton}
      onClick={onAddSkill}
    >
      <span className={styles.buttonIcon}>+</span>
      Add Skill
    </button>
  );

  const hasFilters = filters.search || filters.status !== null;

  return (
    <div className={styles.existingSkills}>
      <SectionHeader 
        title="Existing Skills" 
        actionButton={addButton}
      />

      <SkillFilters
        filters={filters}
        onFilterChange={onFilterChange}
        onSearchChange={onSearchChange}
        onSortChange={onSortChange}
        onClearFilters={onClearFilters}
      />

      <FilterSummary 
        filters={filters} 
        totalCount={pagination.total} 
      />

      {loading && <LoadingSpinner message="Loading skills..." />}

      {error && <ErrorMessage message={error} />}

      {!loading && !error && skills.length === 0 && (
        <EmptyState 
          icon="📚"
          title="No Skills Found"
          hasFilters={hasFilters}
        />
      )}

      {!loading && !error && skills.length > 0 && (
        <SkillsGrid
          skills={skills}
          onStatusChange={onStatusChange}
          lastElementRef={lastElementRef}
          isLoadingMore={isLoadingMore}
        />
      )}
    </div>
  );
};

export default ExistingSkillsSection;
