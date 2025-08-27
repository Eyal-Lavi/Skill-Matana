import React from 'react';
import styles from './SkillFilters.module.scss';

const SearchInput = ({ value, onChange }) => {
  return (
    <div className={styles.searchSection}>
      <div className={styles.searchInput}>
        <input
          type="text"
          placeholder="Search skills..."
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={styles.input}
        />
        <span className={styles.searchIcon}>🔍</span>
      </div>
    </div>
  );
};

export default SearchInput;
