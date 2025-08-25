import style from "./StatCard.module.scss";

export default function StatCard({ icon, title, value, label }) {
  return (
    <div className={style.statCard}>
      <div className={style.statIcon}>{icon}</div>
      <div className={style.statContent}>
        <h3>{title}</h3>
        <p className={style.statNumber}>{value}</p>
        <p className={style.statLabel}>{label}</p>
      </div>
    </div>
  );
}
