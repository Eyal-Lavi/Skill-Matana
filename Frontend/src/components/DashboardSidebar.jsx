import {
  faHome,
  faSearch,
  faUser,
  faCog,
  faChartBar,
  faBookmark,
  faBell
} from "@fortawesome/free-solid-svg-icons";
import Sidebar from "./Sidebar";

const navItems = [
  { path: "/dashboard", icon: faHome, label: "Overview" },
  { path: "/dashboard/search", icon: faSearch, label: "Search" },
  { path: "/dashboard/profile", icon: faUser, label: "Profile" },
  { path: "/dashboard/skills", icon: faChartBar, label: "My Skills" },
  // { path: "/dashboard/bookmarks", icon: faBookmark, label: "Bookmarks" },
  { path: "/dashboard/notifications", icon: faBell, label: "Notifications" },
  { path: "/dashboard/settings", icon: faCog, label: "Settings" },
];

export default function DashboardSidebar() {
  return <Sidebar items={navItems} variant="dashboard" />;
}
