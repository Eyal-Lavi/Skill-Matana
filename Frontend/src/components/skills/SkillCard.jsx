import style from "./SkillCard.module.scss";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SkillCard({ id, title, description, onDelete }) {
  return (
    <div className={style.skillCard}>
      <div className={style.skillHeader}>
        <h3>{title}</h3>
        {onDelete && (
          <button 
            className={style.deleteButton}
            onClick={() => onDelete(id)}
            title="הסר סקיל"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        )}
      </div>
      <p>{description}</p>
      <div className={style.skillBadge}>
        <span>🎓 אני יכול ללמד את זה</span>
      </div>
    </div>
  );
}
