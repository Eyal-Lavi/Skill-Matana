import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectSkills } from "../../features/auth/AuthSelectors";
import SkillCard from "./SkillCard";
import styles from "./EnhancedSkillsGrid.module.scss";

export default function EnhancedSkillsGrid() {
  const userSkills = useSelector(selectSkills);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    if (userSkills && Array.isArray(userSkills)) {
      setSkills(userSkills);
    }
  }, [userSkills]);

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
    <div className={styles.skillsGrid}>
      {skills.map((skill) => (
        <SkillCard
          key={skill.id}
          id={skill.id}
          title={skill.name}
          description={`This is your skill - you can teach this!`}
        />
      ))}
    </div>
  );
}
