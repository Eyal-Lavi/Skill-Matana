import React from 'react';
import SearchInput from './SearchInput';
import FilterControls from './FilterControls';
import styles from './SkillFilters.module.scss';

const SkillFilters = ({ 
  filters, 
  onFilterChange, 
  onSearchChange, 
  onSortChange,
  onClearFilters 
}) => {
  return (
    <div className={styles.filtersContainer}>
      <SearchInput 
        value={filters.search}
        onChange={onSearchChange}
      />
      <FilterControls
        filters={filters}
        onFilterChange={onFilterChange}
        onSortChange={onSortChange}
        onClearFilters={onClearFilters}
      />
    </div>
  );
};

export default SkillFilters;
