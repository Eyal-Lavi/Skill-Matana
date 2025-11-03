import {
  faHome,
  faSearch,
  faUser,
  faCog,
  faChartBar,
  faCalendarDays,
  faCodePullRequest,
  faBell
} from "@fortawesome/free-solid-svg-icons";
import Sidebar from "./Sidebar";
import { useNotifications } from "../contexts/NotificationsContext";

const navItems = [
  { path: "/dashboard", icon: faHome, label: "Overview",end:true },
  { path: "/dashboard/search", icon: faSearch, label: "Search" },
  { path: "/dashboard/profile", icon: faUser, label: "Profile" },
  { path: "/dashboard/skills", icon: faChartBar, label: "My Skill" },
  { path: "/dashboard/availability", icon: faCalendarDays, label: "My Availability" },
  { path: "/dashboard/contact-requests", icon: faCodePullRequest, label: "Contact Requests" },
  { path: "/dashboard/notifications", icon: faBell, label: "Notifications" },
];

export default function DashboardSidebar() {
  const { unreadCount } = useNotifications();

  const badgeCounts = {
    "/dashboard/notifications": unreadCount > 0 ? unreadCount : null
  };

  return <Sidebar items={navItems} variant="dashboard" badgeCounts={badgeCounts} />;
}
