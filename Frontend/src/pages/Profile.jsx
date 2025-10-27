import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { selectUser } from "../features/auth/AuthSelectors";
import { authActions } from '../features/auth/AuthSlices'
import styles from "./Profile.module.scss";
import { ProfileHeader, ProfileView, ProfileEditForm } from "../components/profile";
import authAPI from "../features/auth/AuthAPI";

function Profile() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [error, setError] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      id: user.id,
      username: user.username,
      firstname: user.firstName,
      lastname: user.lastName,
      email: user.email,
      gender: user.gender,
    },
  });

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const onSubmit = async (formValues) => {
    try {
      const payload = {
        id: formValues.id,
        username: formValues.username,
        firstname: formValues.firstname,
        lastname: formValues.lastname,
        email: formValues.email,
        gender: formValues.gender,
      };

      const file = formValues.profilePicture[0];
      if (file) {
        const base64Image = await toBase64(file);
        payload.profileImage = base64Image;
      }

      const data = await authAPI.updateProfile(payload); // שליחת JSON
      dispatch(authActions.updateFromSession(data.user));
      reset(payload);
      setIsEditing(false);
      setError([]);
    } catch (error) {
      console.log("Update profile error:", error);
      
      const errorMessage = error.response?.data?.message;
      setError(errorMessage || "Update failed");
    }
  };

  const handleEditClick = () => {
    reset({
      id: user.id,
      username: user.username,
      firstname: user.firstName,
      lastname: user.lastName,
      email: user.email,
      gender: user.gender,
    });
    setIsEditing(true);
  };

  return (
    <div className={styles.profileContainer}>
      <ProfileHeader title="My Profile" subtitle="Manage your personal info and preferences" />

      <div className={styles.card}>
        {isEditing ? (
          <ProfileEditForm
            register={register}
            watch={watch}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            fieldErrors={errors}
            onCancel={() => setIsEditing(false)}
            error={error}
            currentAvatarUrl={user.profilePicture}
          />
        ) : (
          <ProfileView user={user} onEdit={handleEditClick} />
        )}
      </div>
    </div>
  );
}

export default Profile;
