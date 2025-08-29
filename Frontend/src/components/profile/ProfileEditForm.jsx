import React, { useMemo } from "react";
import Input from "../../utils/components/Input";
import Select from "../../utils/components/Select";
import styles from "../../pages/Profile.module.scss";

export default function ProfileEditForm({
  register,
  watch,
  handleSubmit,
  onSubmit,
  isSubmitting,
  onCancel,
  error,
  currentAvatarUrl,
  fieldErrors = {},
}) {
  const selectedFileList = watch ? watch("profilePicture") : undefined;
  const previewUrl = useMemo(() => {
    const file = selectedFileList && selectedFileList[0];
    if (file) return URL.createObjectURL(file);
    return currentAvatarUrl || "";
  }, [selectedFileList, currentAvatarUrl]);
  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.formLeft}>
        {previewUrl && (
          <div className={styles.avatar}>
            <img src={previewUrl} alt="Preview" className={styles.profileImage} />
          </div>
        )}

          {/* Custom avatar uploader */}
          <input
            id="profilePicture"
            type="file"
            accept="image/*"
            className={styles.fileInputHidden}
            {...register("profilePicture")}
          />
          <label htmlFor="profilePicture" className={styles.avatarButton}>
            Change picture
          </label>
          <p className={styles.hint}>PNG or JPG up to 2MB.</p>
      </div>

      <div className={styles.formRight}>
        <h3 className={styles.sectionTitle}>Personal Info</h3>
        <div className={styles.fieldsGrid}>
          <Input
            label="First Name"
            {...register("firstname", { required: "First name is required", minLength: { value: 2, message: "At least 2 characters" } })}
            error={fieldErrors.firstname}
          />
          <Input
            label="Last Name"
            {...register("lastname", { required: "Last name is required", minLength: { value: 2, message: "At least 2 characters" } })}
            error={fieldErrors.lastname}
          />
          <Input
            label="Email"
            type="email"
            {...register("email", { required: "Email is required", pattern: { value: /[^\s@]+@[^\s@]+\.[^\s@]+/, message: "Enter a valid email" } })}
            error={fieldErrors.email}
          />
          <Select
            {...register("gender", { required: "Select gender" })}
            label="Gender"
            options={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
            error={fieldErrors.gender}
          />
        </div>
      </div>

      <Input label="Username" {...register("username")} hidden />
      <Input label="Id" {...register("id")} hidden />

      {error && error.length > 0 && <p className={styles.errorText}>{error}</p>}

      <div className={styles.buttons}>
        <button type="submit" className={`${styles.submitButton} ${isSubmitting ? styles.isSubmited : ""}`} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Save"}
        </button>
        <button type="button" className={styles.secondaryButton} onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

