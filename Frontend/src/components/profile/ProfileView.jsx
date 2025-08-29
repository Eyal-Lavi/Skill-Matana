import React from "react";
import styles from "../../pages/Profile.module.scss";
import { User as UserIcon, Mail, UserCircle2 } from "lucide-react";

export default function ProfileView({ user, onEdit }) {
  const placeholder = `https://placehold.co/112x112/0f172a/fff?text=${user.username?.[0] || 'U'}`;
  return (
    <>
      <div className={styles.avatar}>
        <img
          src={user.profilePicture || placeholder}
          alt="Profile"
          className={styles.profileImage}
        />
      </div>

      <div className={styles.info}>
        <div className={styles.infoRow}>
          <UserIcon className={styles.infoIcon} />
          <p><strong>Username:</strong> {user.username}</p>
        </div>
        <div className={styles.infoRow}>
          <UserCircle2 className={styles.infoIcon} />
          <p><strong>Full Name:</strong> {user.firstName} {user.lastName}</p>
        </div>
        <div className={styles.infoRow}>
          <Mail className={styles.infoIcon} />
          <p><strong>Email:</strong> {user.email}</p>
        </div>
        <div className={styles.infoRow}>
          <UserCircle2 className={styles.infoIcon} />
          <p><strong>Gender:</strong> {user.gender || "Not specified"}</p>
        </div>
        <button onClick={onEdit} className={styles.editButton}>Edit Profile</button>
      </div>
    </>
  );
}


