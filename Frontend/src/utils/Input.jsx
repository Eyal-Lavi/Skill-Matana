import React, { forwardRef } from "react";
import styles from "./Input.module.scss";

const Input = forwardRef(({ label, type = "text", name, placeholder, required=false, minLength,hidden, error=null, ...rest}, ref) => {
  return (
    <div className={hidden ? styles.inputWrapperHidden : styles.inputWrapper}>
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
        ref={ref}
        {...rest}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
      />
      {error && <p className={styles.error}>{error.message}</p>}
    </div>
  );
});

export default Input;
