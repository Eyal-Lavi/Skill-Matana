import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import style from "./Sidebar.module.scss";

export default function Sidebar({ items, variant = "dashboard", badgeCounts = {} }) {
  return (
    <div className={`${style.sidebar} ${style[variant]}`}>
      <div className={style.sidebarContent}>
        <div className={style.navItems}>
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `${style.navItem} ${isActive ? style.active : ""}`
              }
            >
              <div className={style.iconContainer}>
                <FontAwesomeIcon icon={item.icon} className={style.icon} />
                {badgeCounts[item.path] != null && badgeCounts[item.path] > 0 && (
                  <span className={style.badge}>{badgeCounts[item.path]}</span>
                )}
              </div>
              <span className={style.label}>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
