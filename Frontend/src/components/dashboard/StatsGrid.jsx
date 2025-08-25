import StatCard from "./StatCard";
import style from "./StatsGrid.module.scss";

const statsData = [
  { icon: "📚", title: "My Skills", value: "12", label: "Active skills" },
  { icon: "🎯", title: "Learning Goals", value: "5", label: "In progress" },
  { icon: "⭐", title: "Rating", value: "4.8", label: "Average rating" },
  { icon: "👥", title: "Connections", value: "24", label: "Active connections" },
];

export default function StatsGrid() {
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
