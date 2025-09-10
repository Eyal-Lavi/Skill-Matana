export function ModalHeader({ titleId, title, onClose, disabled, headerClass, closeButtonClass }) {
  return (
    <div className={headerClass}>
      <h2 id={titleId}>{title}</h2>
      <button
        type="button"
        className={closeButtonClass}
        onClick={onClose}
        disabled={disabled}
        aria-label="Close dialog"
      >
        ×
      </button>
    </div>
  );
}
