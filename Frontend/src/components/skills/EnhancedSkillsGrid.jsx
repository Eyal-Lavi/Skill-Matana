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
        <h3>אין לך סקילים עדיין</h3>
        <p>הוסף סקילים מהרשימה או בקש סקיל חדש</p>
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
          description={`זה הסקיל שלך - אתה יכול ללמד את זה!`}
        />
      ))}
    </div>
  );
}
