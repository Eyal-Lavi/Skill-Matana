import {
  faHome,
  faSearch,
  faUser,
  faCog,
  faChartBar,
  faCalendarDays,
  // faBookmark,
  // faUserFriends,
  faCodePullRequest,
  faBell
} from "@fortawesome/free-solid-svg-icons";
import Sidebar from "./Sidebar";

const navItems = [
  { path: "/dashboard", icon: faHome, label: "Overview",end:true },
  { path: "/dashboard/search", icon: faSearch, label: "Search" },
  { path: "/dashboard/profile", icon: faUser, label: "Profile" },
  { path: "/dashboard/skills", icon: faChartBar, label: "My Skills" },
  { path: "/dashboard/availability", icon: faCalendarDays, label: "My Availability" },
  // { path: "/dashboard/bookmarks", icon: faBookmark, label: "Bookmarks" },
  { path: "/dashboard/contact-requests", icon: faCodePullRequest, label: "Contact Requests" },
  { path: "/dashboard/notifications", icon: faBell, label: "Notifications" },
  // { path: "/dashboard/settings", icon: faCog, label: "Settings" },
];

export default function DashboardSidebar() {
  return <Sidebar items={navItems} variant="dashboard" />;
}
