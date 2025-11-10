import React from 'react';
import styles from '../NotificationManagement.module.scss';

const CheckboxField = ({ name, label, checked, onChange }) => (
  <div className={styles.formGroup}>
    <label className={styles.checkboxLabel}>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
      />
      <span>{label}</span>
    </label>
  </div>
);

export default CheckboxField;

