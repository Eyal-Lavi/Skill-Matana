
import { useState, useRef } from "react";
import ModalShell from "../../utils/components/Modal/ModalShell";
import { ModalHeader } from "../../utils/components/Modal/ModalHeader";
import { ModalActions } from "../../utils/components/Modal/ModalActions";
import { TextAreaField } from "../../utils/components/Modal/TextAreaField";
import styles from "./NewContactModal.module.scss";

export default function NewContactModal({ isOpen, onClose, onSendRequest, targetUserName }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const titleId = useRef(`modal-title-${Math.random().toString(36).slice(2)}`);
  const descId = useRef(`modal-desc-${Math.random().toString(36).slice(2)}`);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true); setError("");
    try {
      await onSendRequest?.(message.trim());
      onClose?.();
      setMessage("");
    } catch (err) {
      setError(err?.message || "Failed to send request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={() => !isSubmitting && onClose?.()}
      labelledBy={titleId.current}
      describedBy={descId.current}
      className={styles.modal}
      overlayClass={styles.overlay}
    >
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <ModalHeader
          titleId={titleId.current}
          title="Send connection request"
          onClose={() => !isSubmitting && onClose?.()}
          disabled={isSubmitting}
        />
        <p id={descId.current} className={styles.subtitle} />
        <TextAreaField
          id="message"
          label="Message (optional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Enter message for ${targetUserName || ""}...`}
          disabled={isSubmitting}
          error={error}
        />
        <ModalActions
          onCancel={() => !isSubmitting && onClose?.()}
          submitting={isSubmitting}
          submitText="Send Request"
          submittingText="Adding..."
          cancelText="Cancel"
        />
      </form>
    </ModalShell>
  );
}
