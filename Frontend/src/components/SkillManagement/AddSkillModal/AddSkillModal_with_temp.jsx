import { useState, useRef } from "react";
import ModalShell from "../ui/ModalShell";
import { ModalHeader } from "../ui/ModalHeader";
import { ModalActions } from "../ui/ModalActions";
import styles from "./AddSkillModal.module.scss";

const AddSkillModal = ({ isOpen, onClose, onAddSkill }) => {
  const [skillName, setSkillName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const titleId = useRef(`modal-title-${Math.random().toString(36).slice(2)}`);
  const descId = useRef(`modal-desc-${Math.random().toString(36).slice(2)}`);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!skillName.trim()) {
      setError("Skill name is required");
      return;
    }

    if (skillName.trim().length < 2) {
      setError("Skill name must be at least 2 characters long");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await onAddSkill(skillName.trim());
      setSkillName("");
      onClose?.();
    } catch (err) {
      setError(err.message || "Failed to add skill");
    } finally {
      setIsSubmitting(false);
    }
  };

  const safeClose = () => {
    if (!isSubmitting) {
      setSkillName("");
      setError("");
      onClose?.();
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={safeClose}
      labelledBy={titleId.current}
      describedBy={descId.current}
      className={styles.modal}
      overlayClass={styles.overlay}
    >
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <ModalHeader
          titleId={titleId.current}
          title="Add New Skill"
          onClose={safeClose}
          disabled={isSubmitting}
        />

        <div className={styles.formGroup}>
          <label htmlFor="skillName" className={styles.label}>
            Skill Name
          </label>
          <input
            id="skillName"
            type="text"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            placeholder="Enter skill name..."
            className={styles.input}
            disabled={isSubmitting}
            autoFocus
          />
          {error && (
            <p className={styles.error} role="alert" aria-live="assertive">
              {error}
            </p>
          )}
        </div>

        <ModalActions
          onCancel={safeClose}
          submitting={isSubmitting}
          submitText="Add Skill"
          submittingText="Adding..."
          cancelText="Cancel"
        />
      </form>
    </ModalShell>
  );
};

export default AddSkillModal;
