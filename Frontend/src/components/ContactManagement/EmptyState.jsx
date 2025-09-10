import React from 'react';
import styles from './ContactManagement.module.scss';

const EmptyState = ({ 
  icon = '📚', 
  title = 'No Data Found', 
  message = 'No data available to display.',
  hasFilters = false 
}) => {
  const defaultMessage = hasFilters 
    ? 'Try adjusting your filters or clear them to see all data'
    : 'Add your first item to get started';

  return (
    <div className={styles.emptyContainer}>
      <div className={styles.emptyIcon}>{icon}</div>
      <h3>{title}</h3>
      <p>{message || defaultMessage}</p>
    </div>
  );
};

export default EmptyState;
