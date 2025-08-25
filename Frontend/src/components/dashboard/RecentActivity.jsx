import ActivityItem from "./ActivityItem";
import style from "./RecentActivity.module.scss";

const activityData = [
  {
    icon: "🎨",
    title: "UI/UX Design",
    description: "Completed a new project review",
    time: "2 hours ago"
  },
  {
    icon: "💻",
    title: "React Development",
    description: "Started learning new hooks",
    time: "1 day ago"
  },
  {
    icon: "📱",
    title: "Mobile Development",
    description: "Updated portfolio with new projects",
    time: "3 days ago"
  }
];

export default function RecentActivity() {
  return (
    <div className={style.recentActivity}>
      <h2>Recent Activity</h2>
      <div className={style.activityList}>
        {activityData.map((activity, index) => (
          <ActivityItem
            key={index}
            icon={activity.icon}
            title={activity.title}
            description={activity.description}
            time={activity.time}
          />
        ))}
      </div>
    </div>
  );
}
