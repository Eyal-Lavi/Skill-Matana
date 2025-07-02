import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { selectUser } from "../features/auth/AuthSelectors";
import { authActions } from '../features/auth/AuthSlices'
import styles from "./Profile.module.scss";
import Input from "../utils/Input";
import Select from "../utils/Select";
import authAPI from "../features/auth/AuthAPI";

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

  const onSubmit = async (formData) => {
    try {
      const data = await authAPI.updateProfile(formData);
      dispatch(authActions.login(data.user)); // עדכון ה-store
      reset({
        id: data.user.id,
        username: data.user.username,
        firstname: data.user.firstName,
        lastname: data.user.lastName,
        email: data.user.email,
        gender: data.user.gender,
      });
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
        {user.profilePicture && (
          <img src={user.profilePicture} alt="Profile" className={styles.profileImage} />
        )}

        <div className={styles.info}>
          <p><strong>Username:</strong> {user.username}</p>

          {isEditing ? (
            <form noValidate onSubmit={handleSubmit(onSubmit)} className={styles.form}>
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
