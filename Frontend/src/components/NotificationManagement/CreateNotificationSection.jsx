import React from 'react';
import styles from './NotificationManagement.module.scss';
import CheckboxField from './fields/CheckboxField';
import TextInputField from './fields/TextInputField';
import TextAreaField from './fields/TextAreaField';
import SelectUserField from './fields/SelectUserField';

const CreateNotificationSection = ({
  error,
  success,
  formData,
  users,
  loading,
  handleInputChange,
  handleSubmit,
}) => (
  <form onSubmit={handleSubmit} className={styles.form}>
    {error && <div className={styles.errorMessage}>{error}</div>}
    {success && <div className={styles.successMessage}>{success}</div>}

    <CheckboxField
      name="sendToAll"
      label="Send to all users"
      checked={formData.sendToAll}
      onChange={handleInputChange}
    />

    {!formData.sendToAll && (
      <SelectUserField
        users={users}
        value={formData.userId}
        onChange={handleInputChange}
        required={!formData.sendToAll}
      />
    )}

    <TextInputField
      id="type"
      name="type"
      label="Type"
      value={formData.type}
      onChange={handleInputChange}
      placeholder="e.g., announcement, alert, update"
      required
    />

    <TextInputField
      id="title"
      name="title"
      label="Title"
      value={formData.title}
      onChange={handleInputChange}
      placeholder="Notification title"
      required
    />

    <TextAreaField
      id="message"
      name="message"
      label="Message"
      value={formData.message}
      onChange={handleInputChange}
      placeholder="Notification message content"
      required
      rows={5}
    />

    <TextInputField
      id="link"
      name="link"
      label="Link (Optional)"
      value={formData.link}
      onChange={handleInputChange}
      placeholder="e.g., /dashboard/settings, /profile"
      helpText="Relative path where users will be redirected when clicking the notification"
    />

    <div className={styles.formActions}>
      <button type="submit" disabled={loading} className={styles.submitButton}>
        {loading ? 'Creating...' : formData.sendToAll ? 'Send to All Users' : 'Send Notification'}
      </button>
    </div>
  </form>
);

export default CreateNotificationSection;
