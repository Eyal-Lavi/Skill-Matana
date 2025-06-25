import React, { forwardRef } from "react";
import style from "./Input.module.scss";

const Select = forwardRef(({ label, name, options = [], required = false, ...rest }, ref) => {
  return (
    <div className={style.inputWrapper}>
      {label && <label htmlFor={name} className={style.label}>{label}</label>}
      <select
        id={name}
        name={name}
        ref={ref}
        required={required}
        className={style.input}
        {...rest}
      >
        <option value='' disabled>Select</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
});

export default Select;
