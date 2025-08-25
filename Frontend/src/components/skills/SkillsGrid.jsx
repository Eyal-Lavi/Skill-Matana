import SkillCard from "./SkillCard";
import style from "./SkillsGrid.module.scss";

const skillsData = [
  {
    title: "React Development",
    progress: 85,
    description: "Advanced React development with hooks and modern patterns"
  },
  {
    title: "UI/UX Design",
    progress: 92,
    description: "User interface and experience design with modern tools"
  },
  {
    title: "Node.js Backend",
    progress: 78,
    description: "Server-side development with Node.js and Express"
  }
];

export default function SkillsGrid() {
  return (
    <div className={style.skillsGrid}>
      {skillsData.map((skill, index) => (
        <SkillCard
          key={index}
          title={skill.title}
          progress={skill.progress}
          description={skill.description}
        />
      ))}
    </div>
  );
}
