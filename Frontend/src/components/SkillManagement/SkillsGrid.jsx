import React from 'react';
import SkillCard from './SkillCard';
import LoadingSpinner from './LoadingSpinner';
import styles from './SkillManagement.module.scss';

const SkillsGrid = ({ 
  skills, 
  onStatusChange, 
  lastElementRef, 
  isLoadingMore 
}) => {
  return (
    <div className={styles.skillsGrid}>
      {skills.map((skill, index) => (
        <SkillCard
          key={skill.id}
          skill={skill}
          onStatusChange={onStatusChange}
          isLast={index === skills.length - 1}
          lastElementRef={lastElementRef}
        />
      ))}
      
      {isLoadingMore && (
        <div className={styles.loadingMore}>
          <LoadingSpinner message="Loading more skills..." />
        </div>
      )}
    </div>
  );
};

export default SkillsGrid;
