export default function ModalShell({
  isOpen,
  onClose,
  children,
  labelledBy,
  describedBy,
  overlayClass,
  modalClass,
}) {
  if (!isOpen) return null;

  const onOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div className={overlayClass} onClick={onOverlayClick}>
      <div
        className={modalClass}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
