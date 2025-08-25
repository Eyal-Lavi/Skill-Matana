import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTools } from "@fortawesome/free-solid-svg-icons";
import style from "./DashboardPlaceholder.module.scss";

function DashboardPlaceholder({ title, description, icon = faTools }) {
  return (
    <div className={style.placeholder}>
      <div className={style.iconContainer}>
        <FontAwesomeIcon icon={icon} className={style.icon} />
      </div>
      <h1>{title}</h1>
      <p>{description}</p>
      <div className={style.comingSoon}>
        <span>Coming Soon</span>
      </div>
    </div>
  );
}

export default DashboardPlaceholder;
