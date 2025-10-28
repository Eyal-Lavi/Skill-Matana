import { useSelector } from "react-redux";
import StatCard from "./StatCard";
import style from "./StatsGrid.module.scss";
import { selectConnections, selectSkills } from "../../features/auth/authSelectors";



export default function StatsGrid() {
  const skills = useSelector(selectSkills);
  const connections = useSelector(selectConnections);
  const skillLength = skills ? skills.length : 12;
  console.log(skillLength);
  
  const statsData = [
    { icon: "📚", title: "My Skills", value: skillLength, label: "Active skills" },
    { icon: "👥", title: "Connections", value: connections.length , label: "Active connections" },
  ];

  return (
    <div className={style.statsGrid}>
      {statsData.map((stat, index) => (
        <StatCard
          key={index}
          icon={stat.icon}
          title={stat.title}
          value={stat.value}
          label={stat.label}
        />
      ))}
    </div>
  );
}
