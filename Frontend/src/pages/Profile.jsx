import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { selectUser } from "../features/auth/AuthSelectors";
import { authActions } from '../features/auth/AuthSlices'
import styles from "./Profile.module.scss";
import Input from "../utils/components/Input";
import Select from "../utils/components/Select";
import authAPI from "../features/auth/AuthAPI";
const apiUrl = import.meta.env.VITE_API_URL;

function Profile() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [error, setError] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      id: user.id,
      username: user.username,
      firstname: user.firstName,
      lastname: user.lastName,
      email: user.email,
      gender: user.gender,
    },
  });

  const onSubmit = async (formValues) => {
    try {
      const formData = new FormData();
      formData.append("id", formValues.id);
      formData.append("username", formValues.username);
      formData.append("firstname", formValues.firstname);
      formData.append("lastname", formValues.lastname);
      formData.append("email", formValues.email);
      formData.append("gender", formValues.gender);

      // תומך בקובץ רק אם קיים
      if (formValues.profilePicture?.[0]?.url) {
        formData.append("profilePicture", formValues.profilePicture[0]);
      }

      const data = await authAPI.updateProfile(formData);
      dispatch(authActions.updateFromSession(data.user));
      reset(formValues); // אם צריך
      setIsEditing(false);
      setError([]);
    } catch (error) {
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
      <h2 className={styles.title}>My Profile</h2>

      <div className={styles.card}>
        {user.profilePicture ? (
          <img src={apiUrl + user.profilePicture[0]?.url} alt="Profile" className={styles.profileImage} />
        ) : (
          <p>No profile picture uploaded.</p>
        )}

        <div className={styles.info}>
          <p><strong>Username:</strong> {user.username}</p>

          {isEditing ? (
            <form noValidate onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              <Input
                label="Profile Picture"
                type="file"
                {...register("profilePicture")}
              />
              <Input label="Username" {...register("username")} hidden />
              <Input label="Id" {...register("id")} hidden />
              <Input label="First Name" {...register("firstname")} />
              <Input label="Last Name" {...register("lastname")} />
              <Input label="Email" type="email" {...register("email")} />
              <Select
                {...register("gender")}
                label="Gender"
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                ]}
              />
              {error.length > 0 && <p className={styles.errorText}>{error}</p>}

              <div className={styles.buttons}>
                <button
                  type="submit"
                  className={`${styles.submitButton} ${isSubmitting ? styles.isSubmited : ""}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Save"}
                </button>
                <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </form>
          ) : (
            <>
              <p><strong>Full Name:</strong> {user.firstName} {user.lastName}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Gender:</strong> {user.gender || "Not specified"}</p>
              <button onClick={handleEditClick} className={styles.editButton}>Edit Profile</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
