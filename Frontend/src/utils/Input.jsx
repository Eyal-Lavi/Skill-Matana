import React, { forwardRef } from "react";
import styles from "./Input.module.scss";

const Input = forwardRef(({ label, type = "text", name, placeholder, required, minLength, ...rest }, ref) => {
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
        ref={ref}
        {...rest}
        className={styles.input}
      />
    </div>
  );
});

export default Input;
