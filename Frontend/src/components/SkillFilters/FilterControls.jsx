import React from 'react';
import FilterSelect from './FilterSelect';
import styles from './SkillFilters.module.scss';

const FilterControls = ({ 
  filters, 
  onFilterChange, 
  onSortChange, 
  onClearFilters 
}) => {
  const handleStatusChange = (e) => {
    const value = e.target.value === '' ? null : parseInt(e.target.value);
    onFilterChange('status', value);
  };

  const handleSortByChange = (e) => {
    onSortChange('sortBy', e.target.value);
  };

  const handleSortOrderChange = (e) => {
    onSortChange('sortOrder', e.target.value);
  };

  const statusOptions = [
    { value: 1, label: 'Active' },
    { value: 0, label: 'Inactive' }
  ];

  const sortByOptions = [
    { value: 'name', label: 'Name' },
    { value: 'status', label: 'Status' },
    { value: 'id', label: 'ID' }
  ];

  const sortOrderOptions = [
    { value: 'ASC', label: 'Ascending' },
    { value: 'DESC', label: 'Descending' }
  ];

  return (
    <div className={styles.filterSection}>
      <FilterSelect
        label="Status"
        value={filters.status !== null ? filters.status : ''}
        onChange={handleStatusChange}
        options={statusOptions}
        placeholder="All Status"
      />

      <FilterSelect
        label="Sort By"
        value={filters.sortBy || 'name'}
        onChange={handleSortByChange}
        options={sortByOptions}
      />

      <FilterSelect
        label="Order"
        value={filters.sortOrder || 'ASC'}
        onChange={handleSortOrderChange}
        options={sortOrderOptions}
      />

      <button
        onClick={onClearFilters}
        className={styles.clearButton}
      >
        Clear Filters
      </button>
    </div>
  );
};

export default FilterControls;
