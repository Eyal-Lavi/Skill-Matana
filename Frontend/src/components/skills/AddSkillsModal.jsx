import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectSkills } from "../../features/auth/AuthSelectors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes, faCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
import MetaDataAPI from "../../features/metaData/MetaDataAPI";
import styles from "./AddSkillsModal.module.scss";

export default function AddSkillsModal({ isOpen, onClose }) {
  const userSkills = useSelector(selectSkills);
  const [allSkills, setAllSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isOpen) {
      loadAvailableSkills();
    }
  }, [isOpen]);

  const loadAvailableSkills = async () => {
    setLoading(true);
    try {
      const response = await MetaDataAPI.metaData();
      const availableSkills = response.skills.data || [];
      
      
      const userSkillIds = userSkills?.map(skill => skill.id) || [];
      const filtered = availableSkills.filter(skill => !userSkillIds.includes(skill.id));
      
      setAllSkills(filtered);
      setFilteredSkills(filtered);
    } catch (error) {
      setError("לא הצלחנו לטעון את הסקילים");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = allSkills.filter(skill =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSkills(filtered);
    } else {
      setFilteredSkills(allSkills);
    }
  }, [searchTerm, allSkills]);

  const handleAddSkill = async (skillId, skillName) => {
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/skills/add-user-skill`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ skillId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "הוספת הסקיל נכשלה");
      }

      setSuccess(`הסקיל "${skillName}" נוסף בהצלחה!`);
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1500);
    } catch (error) {
      setError(error.message || "שגיאה בהוספת הסקיל");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>הוסף סקילים</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className={styles.searchContainer}>
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="חפש סקיל..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <div className={styles.skillsList}>
          {loading && <div className={styles.loading}>טוען...</div>}
          {!loading && filteredSkills.length === 0 && (
            <div className={styles.emptyState}>לא נמצאו סקילים</div>
          )}
          {!loading && filteredSkills.map((skill) => (
            <div key={skill.id} className={styles.skillItem}>
              <span className={styles.skillName}>{skill.name}</span>
              <button
                className={styles.addButton}
                onClick={() => handleAddSkill(skill.id, skill.name)}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faPlus} />
                הוסף
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
