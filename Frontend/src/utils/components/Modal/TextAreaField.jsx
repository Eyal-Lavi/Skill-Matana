export function TextAreaField({
  id, label, value, onChange, placeholder, disabled, rows = 4,
  formGroupClass, labelClass, inputClass, error, errorClass
}) {
  return (
    <div className={formGroupClass}>
      <label htmlFor={id} className={labelClass}>{label}</label>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={inputClass}
      />
      {error && <p className={errorClass} role="alert" aria-live="assertive">{error}</p>}
    </div>
  );
}
