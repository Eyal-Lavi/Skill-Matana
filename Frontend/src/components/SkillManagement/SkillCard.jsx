import React from 'react';
import styles from './SkillManagement.module.scss';

const SkillCard = ({ skill, onStatusChange, isLast, lastElementRef }) => {
  return (
    <div 
      className={styles.skillCard}
      ref={isLast ? lastElementRef : null}
    >
      <div className={styles.skillInfo}>
        <h3 className={styles.skillName}>{skill.name}</h3>
        <span className={`${styles.statusBadge} ${skill.status === 1 ? styles.active : styles.inactive}`}>
          {skill.status === 1 ? 'Active' : 'Inactive'}
        </span>
      </div>
      <div className={styles.skillActions}>
        <button
          className={`${styles.actionButton} ${skill.status === 1 ? styles.deactivateButton : styles.activateButton}`}
          onClick={() => onStatusChange(skill.id, skill.status === 1 ? 0 : 1)}
        >
          {skill.status === 1 ? 'Deactivate' : 'Activate'}
        </button>
      </div>
    </div>
  );
};

export default SkillCard;
