import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  selectFirstName,
  selectLastName,
  selectEmail,
  selectUsername,
  selectProfilePicture,
  selectGender,
} from "../features/auth/AuthSelectors";
import styles from "./Profile.module.scss";
import Input from "../utils/Input";
import Select from "../utils/Select";

function Profile() {
  const dispatch = useDispatch(); // אם תרצה לשלוח עדכון בעתיד

  const firstname = useSelector(selectFirstName);
  const lastname = useSelector(selectLastName);
  const email = useSelector(selectEmail);
  const username = useSelector(selectUsername);
  const profilePicture = useSelector(selectProfilePicture);
  const gender = useSelector(selectGender);

  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, reset ,formState: {errors,isSubmitting}} = useForm({
    defaultValues: {
      firstname,
      lastname,
      email,
      gender,
    },
  });

  const onSubmit = (data) => {
    console.log("Updated profile:", data);
    // dispatch(updateUserProfile(data)); // תוסיף פעולה אם צריך
    setIsEditing(false);
  };

  const handleEditClick = () => {
    reset({ firstname, lastname, email, gender });
    setIsEditing(true);
  };

  return (
    <div className={styles.profileContainer}>
      <h2 className={styles.title}>My Profile</h2>

      <div className={styles.card}>
        {profilePicture && (
          <img src={profilePicture} alt="Profile" className={styles.profileImage} />
        )}

        <div className={styles.info}>
          <p><strong>Username:</strong> {username}</p>

          {isEditing ? (
            <form noValidate onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              <Input 
                label="First Name"
                type="firstname"
                {...register("firstname")}
              />
              <Input 
                label="Last Name"
                type="lastname"
                {...register("lastname")}
              />
              <Input 
                label="Email"
                type="email"
                {...register("email")}
              />
               <Select {...register("gender")} 
                  label="Gender"
                  option={[
                    {value: "male" , label: "Male"},
                    {value: "female" , label: "Female"},
                  ]}
                />
              <div className={styles.buttons}>
                <button 
                  type="submit"
                  className={`${styles.submitButton} ${isSubmitting ? styles.isSubmited : ""}`}
                  disabled={isSubmitting}
                >{isSubmitting ? "Submitting..." : "Save"}</button>
                
                <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </form>
          ) : (
            <>
              <p><strong>Full Name:</strong> {firstname} {lastname}</p>
              <p><strong>Email:</strong> {email}</p>
              <p><strong>Gender:</strong> {gender || "Not specified"}</p>
              <button onClick={handleEditClick} className={styles.editButton}>Edit Profile</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export default Profile;