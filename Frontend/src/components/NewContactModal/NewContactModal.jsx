import { useState } from "react";
import styles from "./NewContactModal.module.scss";

const NewContactModal = ({
  isOpen,
  onClose,
  onSendRequest,
  targetUserName,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError("");

    try {
      await onSendRequest(message);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to send request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setError("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Send connection request</h2>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            {/* <div className={styles.confirmationText}>
              You sure you want to send a connection request to{" "}
              <strong>{targetUserName}</strong>?
            </div> */}
            
            <label htmlFor="Message" className={styles.label}>
              Message (optional)
            </label>
            
            <textarea
              id="Message"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Enter message for ${targetUserName}...`}
              className={styles.input}
              disabled={isSubmitting}
              maxLength={255}
              autoFocus
            ></textarea>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <button
              type="button"
              onClick={handleClose}
              className={styles.cancelButton}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className={styles.spinner}></span>
                  Adding...
                </>
              ) : (
                "Send Request"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewContactModal;
