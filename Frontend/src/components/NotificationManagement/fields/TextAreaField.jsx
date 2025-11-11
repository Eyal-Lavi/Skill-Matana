import React from 'react';
import styles from '../NotificationManagement.module.scss';

const TextAreaField = ({ id, name, label, value, onChange, placeholder, required, rows = 5 }) => (
  <div className={styles.formGroup}>
    {label && <label htmlFor={id}>{label}{required ? ' *' : ''}</label>}
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      rows={rows}
      className={styles.textarea}
    />
  </div>
);

export default TextAreaField;

