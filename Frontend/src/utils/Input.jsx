import React, { forwardRef } from "react";
import styles from "./Input.module.scss";

const Input = forwardRef(({ label, type = "text", name, placeholder, required=false, minLength, error=null, ...rest}, ref) => {
  const inputRef = ref || rest.ref;
  return (
    <div className={styles.inputWrapper}>
      {label && (
        <label htmlFor={name} className={styles.label}>{label}</label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        ref={inputRef}
        {...rest}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
      />
      {error && <p className={styles.error}>{error.message}</p>}
    </div>
  );
});

export default Input;
