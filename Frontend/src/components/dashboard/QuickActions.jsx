import { useNavigate } from 'react-router-dom';
import style from "./QuickActions.module.scss";

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      icon: "➕",
      title: "Add Availability",
      description: "Set your available times",
      onClick: () => navigate("/dashboard/my-availability"),
      color: "#667eea"
    },
    {
      icon: "📅",
      title: "Schedule Meeting",
      description: "Book a lesson",
      onClick: () => navigate("/dashboard/contact-requests"),
      color: "#764ba2"
    },
    {
      icon: "🔔",
      title: "View Notifications",
      description: "Check your alerts",
      onClick: () => navigate("/dashboard/notifications"),
      color: "#f093fb"
    },
    {
      icon: "📚",
      title: "Manage Skills",
      description: "Update your skills",
      onClick: () => navigate("/dashboard/skills"),
      color: "#4facfe"
    }
  ];

  return (
    <div className={style.quickActions}>
      <h2>Quick Actions</h2>
      <div className={style.actionsGrid}>
        {actions.map((action, index) => (
          <div
            key={index}
            className={style.actionCard}
            onClick={action.onClick}
            style={{ '--action-color': action.color }}
          >
            <div className={style.actionIcon}>{action.icon}</div>
            <div className={style.actionContent}>
              <h3>{action.title}</h3>
              <p>{action.description}</p>
            </div>
            <div className={style.actionArrow}>→</div>
          </div>
        ))}
      </div>
    </div>
  );
}

