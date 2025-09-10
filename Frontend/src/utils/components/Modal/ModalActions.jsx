export function ModalActions({
  onCancel,
  submitting,
  submitText,
  submittingText,
  cancelText = "Cancel",
  actionsClass,
  cancelButtonClass,
  submitButtonClass,
  spinnerClass,
}) {
  return (
    <div className={actionsClass}>
      <button type="button" onClick={onCancel} disabled={submitting} className={cancelButtonClass}>
        {cancelText}
      </button>
      <button type="submit" disabled={submitting} className={submitButtonClass}>
        {submitting ? (<><span className={spinnerClass} aria-hidden="true" />{submittingText}</>) : submitText}
      </button>
    </div>
  );
}
