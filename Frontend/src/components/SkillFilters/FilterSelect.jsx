import React from 'react';
import styles from './SkillFilters.module.scss';

const FilterSelect = ({ 
  label, 
  value, 
  onChange, 
  options, 
  placeholder = "Select..." 
}) => {
  return (
    <div className={styles.filterGroup}>
      <label className={styles.filterLabel}>{label}:</label>
      <select
        value={value}
        onChange={onChange}
        className={styles.select}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterSelect;
