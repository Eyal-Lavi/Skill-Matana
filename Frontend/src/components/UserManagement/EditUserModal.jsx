import React, { useState, useEffect } from 'react';
import styles from './EditUserModal.module.scss';

const EditUserModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    userId: '',
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    password: '',
    instagramUrl: '',
    linkedinUrl: '',
    githubUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        userId: user.id || '',
        username: user.username || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        gender: user.gender || '',
        password: '',
        instagramUrl: user.instagramUrl || '',
        linkedinUrl: user.linkedinUrl || '',
        githubUrl: user.githubUrl || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.firstName || !formData.lastName || !formData.email || !formData.gender) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const userData = {
        userId: formData.userId,
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        gender: formData.gender,
        instagramUrl: formData.instagramUrl || null,
        linkedinUrl: formData.linkedinUrl || null,
        githubUrl: formData.githubUrl || null
      };

      // Only include password if it's not empty
      if (formData.password && formData.password.trim() !== '') {
        userData.password = formData.password;
      }

      await onSave(userData);
      setFormData(prev => ({ ...prev, password: '' }));
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setError('');
      setFormData(prev => ({ ...prev, password: '' }));
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Edit User</h2>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="username" className={styles.label}>
                Username *
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className={styles.input}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="firstName" className={styles.label}>
                First Name *
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                className={styles.input}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="lastName" className={styles.label}>
                Last Name *
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                className={styles.input}
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="gender" className={styles.label}>
                Gender *
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={styles.input}
                disabled={isSubmitting}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                New Password (leave empty to keep current)
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={styles.input}
                disabled={isSubmitting}
                placeholder="Enter new password"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="instagramUrl" className={styles.label}>
              Instagram URL
            </label>
            <input
              id="instagramUrl"
              name="instagramUrl"
              type="url"
              value={formData.instagramUrl}
              onChange={handleChange}
              className={styles.input}
              disabled={isSubmitting}
              placeholder="https://instagram.com/username"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="linkedinUrl" className={styles.label}>
              LinkedIn URL
            </label>
            <input
              id="linkedinUrl"
              name="linkedinUrl"
              type="url"
              value={formData.linkedinUrl}
              onChange={handleChange}
              className={styles.input}
              disabled={isSubmitting}
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="githubUrl" className={styles.label}>
              GitHub URL
            </label>
            <input
              id="githubUrl"
              name="githubUrl"
              type="url"
              value={formData.githubUrl}
              onChange={handleChange}
              className={styles.input}
              disabled={isSubmitting}
              placeholder="https://github.com/username"
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

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
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className={styles.spinner}></span>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;

