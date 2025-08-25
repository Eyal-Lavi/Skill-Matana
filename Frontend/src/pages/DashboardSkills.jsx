import { SkillsGrid } from "../components/skills";
import style from "./DashboardSkills.module.scss";

function DashboardSkills() {
  return (
    <div className={style.skillsPage}>
      <div className={style.header}>
        <h1>My Skills</h1>
        <p>Manage and showcase your professional skills</p>
      </div>
      
      <SkillsGrid />
    </div>
  );
}

export default DashboardSkills;
