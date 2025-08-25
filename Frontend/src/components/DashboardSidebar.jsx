import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faSearch,
  faUser,
  faCog,
  faChartBar,
  faBookmark,
  faBell
} from "@fortawesome/free-solid-svg-icons";
import style from "./DashboardSidebar.module.scss";

const navItems = [
  { path: "/dashboard", icon: faHome, label: "Overview" },
  { path: "/dashboard/search", icon: faSearch, label: "Search" },
  { path: "/dashboard/profile", icon: faUser, label: "Profile" },
  { path: "/dashboard/skills", icon: faChartBar, label: "My Skills" },
  { path: "/dashboard/bookmarks", icon: faBookmark, label: "Bookmarks" },
  { path: "/dashboard/notifications", icon: faBell, label: "Notifications" },
  { path: "/dashboard/settings", icon: faCog, label: "Settings" },
];

export default function DashboardSidebar() {
  return (
    <div className={style.sidebar}>
      <div className={style.sidebarContent}>
        <div className={style.navItems}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `${style.navItem} ${isActive ? style.active : ""}`
              }
            >
              <div className={style.iconContainer}>
                <FontAwesomeIcon icon={item.icon} className={style.icon} />
              </div>
              <span className={style.label}>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
