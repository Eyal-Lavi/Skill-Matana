import style from "./ActivityItem.module.scss";

export default function ActivityItem({ icon, title, description, time }) {
  return (
    <div className={style.activityItem}>
      <div className={style.activityIcon}>{icon}</div>
      <div className={style.activityContent}>
        <h4>{title}</h4>
        <p>{description}</p>
        <span className={style.activityTime}>{time}</span>
      </div>
    </div>
  );
}
