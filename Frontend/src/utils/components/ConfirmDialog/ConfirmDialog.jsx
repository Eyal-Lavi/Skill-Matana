import React from "react";
import ModalShell from "../Modal/ModalShell";
import { ModalHeader } from "../Modal/ModalHeader";
import styles from "./ConfirmDialog.module.scss";

export default function ConfirmDialog({
  isOpen,
  title = "Confirm",
  message = "",
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = false,
  onConfirm,
  onCancel,
  onClose,
}) {
  const titleId = "confirmDialogTitle";
  const messageId = "confirmDialogMessage";

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      labelledBy={titleId}
      describedBy={messageId}
      overlayClass={styles.overlay}
      modalClass={styles.modal}
    >
      <ModalHeader
        titleId={titleId}
        title={title}
        onClose={onClose}
        headerClass={styles.header}
        closeButtonClass={styles.closeBtn}
      />

      <div className={styles.content} id={messageId}>
        {message}
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.btn} onClick={onCancel}>
          {cancelText}
        </button>
        <button
          type="button"
          className={`${styles.btn} ${danger ? styles.danger : styles.primary}`}
          onClick={onConfirm}
        >
          {confirmText}
        </button>
      </div>
    </ModalShell>
  );
}

