import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { selectUserId } from "../../features/auth/AuthSelectors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faCheck } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import styles from "./EnhancedAddSkillRequest.module.scss";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function EnhancedAddSkillRequest() {
  const inputRef = useRef(null);
  const userId = useSelector(selectUserId);
  const [skillName, setSkillName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    const name = skillName.trim();
    if (!name || name.length < 2) {
      setError("נא להכניס שם סקיל (לפחות 2 תווים)");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${API_BASE_URL}/skills/skill-requests`,
        { name, requestedBy: userId },
        { withCredentials: true }
      );
      
      setSuccess(true);
      setSkillName("");
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
      setError(error.response?.data?.message || "שגיאה בשליחת הבקשה");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.iconContainer}>
            <FontAwesomeIcon icon={faPaperPlane} />
          </div>
          <h3>בקש סקיל חדש</h3>
          <p>אין לך את הסקיל שאתה מחפש? בקש מנהל מערכת להוסיף אותו</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              ref={inputRef}
              type="text"
              placeholder="הכנס שם הסקיל שברצונך לבקש..."
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              className={styles.input}
              disabled={loading}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}
          {success && (
            <div className={styles.success}>
              <FontAwesomeIcon icon={faCheck} />
              <span>הבקשה נשלחה בהצלחה!</span>
            </div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading || !skillName.trim()}
          >
            {loading ? "שולח..." : "שלח בקשה"}
          </button>
        </form>
      </div>
    </div>
  );
}
