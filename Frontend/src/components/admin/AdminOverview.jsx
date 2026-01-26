import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminAPI from "../../features/admin/adminAPI";
import StatCard from "../dashboard/StatCard";
import style from "./AdminOverview.module.scss";

export default function AdminOverview() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: { total: 0, active: 0, inactive: 0 },
    skills: { total: 0, active: 0, inactive: 0 },
    pendingSkillRequests: 0,
    notifications: { total: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await AdminAPI.getOverviewStats();
      setStats(data);
    } catch (err) {
      console.error('Error loading admin overview stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    { 
      icon: "👥", 
      title: "Total Users", 
      value: loading ? "..." : stats.users.total, 
      label: `${stats.users.active} active, ${stats.users.inactive} inactive`,
      onClick: () => navigate("/admin/users") 
    },
    { 
      icon: "✅", 
      title: "Active Users", 
      value: loading ? "..." : stats.users.active, 
      label: "Currently active",
      onClick: () => navigate("/admin/users") 
    },
    { 
      icon: "📚", 
      title: "Total Skills", 
      value: loading ? "..." : stats.skills.total, 
      label: `${stats.skills.active} active, ${stats.skills.inactive} inactive`,
      onClick: () => navigate("/admin/skills") 
    },
    { 
      icon: "✅", 
      title: "Active Skills", 
      value: loading ? "..." : stats.skills.active, 
      label: "Currently active",
      onClick: () => navigate("/admin/skills") 
    },
    { 
      icon: "⏳", 
      title: "Pending Requests", 
      value: loading ? "..." : stats.pendingSkillRequests, 
      label: "Skill requests awaiting review",
      onClick: () => navigate("/admin/skills") 
    },
    { 
      icon: "🔔", 
      title: "Notifications", 
      value: loading ? "..." : stats.notifications.total, 
      label: "Total system notifications",
      onClick: () => navigate("/admin/notifications") 
    },
  ];

  return (
    <div className={style.adminOverview}>
      <div className={style.header}>
        <h1>Admin Overview</h1>
        <p className={style.subtitle}>System statistics and key metrics</p>
      </div>
      <div className={style.statsGrid}>
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
            label={stat.label}
            onClick={stat.onClick}
          />
        ))}
      </div>
    </div>
  );
}
