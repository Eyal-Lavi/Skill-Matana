import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectSkills } from "../../features/auth/AuthSelectors";
import { authActions } from "../../features/auth/AuthSlices";
import { useConfirm } from "../../contexts/ConfirmContext";
import SkillCard from "./SkillCard";
import styles from "./EnhancedSkillsGrid.module.scss";

export default function EnhancedSkillsGrid() {
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const userSkills = useSelector(selectSkills);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (userSkills && Array.isArray(userSkills)) {
      setSkills(userSkills);
    }
  }, [userSkills]);

  const handleDeleteSkill = async (skillId) => {
    const skillName = skills.find(s => s.id === skillId)?.name || "this skill";
    
    const ok = await confirm({
      title: "Remove Skill?",
      message: `Are you sure you want to remove "${skillName}"? This action cannot be undone.`,
      confirmText: "Remove",
      cancelText: "Cancel",
      danger: true,
    });

    if (!ok) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/skills/remove-user-skill`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ skillId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to remove skill");
      }

      // Update Redux state
      dispatch(authActions.removeSkill(skillId));
    } catch (error) {
      setError(error.message || "Error removing skill");
      console.error("Error removing skill:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!skills || skills.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>🎯</div>
        <h3>You don't have any skills yet</h3>
        <p>Add skills from the list or request a new skill</p>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className={styles.errorMessage} style={{ color: "red", marginBottom: "1rem" }}>
          {error}
        </div>
      )}
      <div className={styles.skillsGrid}>
        {skills.map((skill) => (
          <SkillCard
            key={skill.id}
            id={skill.id}
            title={skill.name}
            description={`This is your skill - you can teach this!`}
            onDelete={handleDeleteSkill}
          />
        ))}
      </div>
    </>
  );
}
