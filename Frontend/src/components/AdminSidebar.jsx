import { faGaugeHigh, faUsers, faClipboardList, faGear } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "./Sidebar";

const navItems = [
  { path: "/admin", icon: faGaugeHigh, label: "Overview", end: true },
  { path: "/admin/users", icon: faUsers, label: "Users" },
  { path: "/admin/skills", icon: faClipboardList, label: "Skill" },
  { path: "/admin/settings", icon: faGear, label: "Settings" },
];

export default function AdminSidebar() {
  return <Sidebar items={navItems} variant="admin" />;
}
