import React from 'react';
import styles from '../NotificationManagement.module.scss';

const SelectUserField = ({ id = 'userId', name = 'userId', label = 'Select User', users = [], value, onChange, required }) => (
  <div className={styles.formGroup}>
    <label htmlFor={id}>{label}{required ? ' *' : ''}</label>
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className={styles.select}
    >
      <option value="">Choose a user...</option>
      {users.map((user) => (
        <option key={user.id} value={user.id}>
          {user.firstName} {user.lastName} (@{user.username}) - {user.email}
        </option>
      ))}
    </select>
  </div>
);

export default SelectUserField;

