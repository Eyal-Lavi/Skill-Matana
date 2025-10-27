import { useState } from "react";
import { EnhancedSkillsGrid, AddSkillsModal, EnhancedAddSkillRequest } from "../components/skills";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import style from "./DashboardSkills.module.scss";

function DashboardSkills() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={style.skillsPage}>
      <div className={style.header}>
        <div>
          <h1>הסקילים שלי</h1>
          <p>נהל את הסקילים שלך - הוסף או הסר סקילים</p>
        </div>
        <button className={style.addButton} onClick={() => setIsModalOpen(true)}>
          <FontAwesomeIcon icon={faPlus} />
          <span>הוסף סקילים</span>
        </button>
      </div>

      <EnhancedSkillsGrid />

      <EnhancedAddSkillRequest />

      <AddSkillsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default DashboardSkills;