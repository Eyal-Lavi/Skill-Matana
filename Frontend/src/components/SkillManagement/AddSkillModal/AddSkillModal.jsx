import React, { useState } from 'react';
import styles from './AddSkillModal.module.scss';

const AddSkillModal = ({ isOpen, onClose, onAddSkill }) => {
  const [skillName, setSkillName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!skillName.trim()) {
      setError('Skill name is required');
      return;
    }

    if (skillName.trim().length < 2) {
      setError('Skill name must be at least 2 characters long');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onAddSkill(skillName.trim());
      setSkillName('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add skill');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSkillName('');
      setError('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Add New Skill</h2>
          <button 
            className={styles.closeButton}
            onClick={handleClose}
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="skillName" className={styles.label}>
              Skill Name
            </label>
            <input
              id="skillName"
              type="text"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              placeholder="Enter skill name..."
              className={styles.input}
              disabled={isSubmitting}
              autoFocus
            />
            {error && <p className={styles.error}>{error}</p>}
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={handleClose}
              className={styles.cancelButton}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting || !skillName.trim()}
            >
              {isSubmitting ? (
                <>
                  <span className={styles.spinner}></span>
                  Adding...
                </>
              ) : (
                'Add Skill'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSkillModal;
