import style from "./SkillCard.module.scss";

export default function SkillCard({ title, progress, description }) {
  return (
    <div className={style.skillCard}>
      <h3>{title}</h3>
      <div className={style.skillLevel}>
        <div className={style.progressBar}>
          <div className={style.progress} style={{ width: `${progress}%` }}></div>
        </div>
        <span>{progress}%</span>
      </div>
      <p>{description}</p>
    </div>
  );
}
