import React from 'react';
import styles from '../NotificationManagement.module.scss';

const TextInputField = ({ id, name, label, value, onChange, placeholder, required, helpText }) => (
  <div className={styles.formGroup}>
    {label && <label htmlFor={id}>{label}{required ? ' *' : ''}</label>}
    <input
      type="text"
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={styles.input}
    />
    {helpText && (
      <small className={styles.helpText}>{helpText}</small>
    )}
  </div>
);

export default TextInputField;
