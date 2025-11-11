import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import StatCard from "./StatCard";
import style from "./StatsGrid.module.scss";
import { selectConnections, selectSkills } from "../../features/auth/authSelectors";
import { useNavigate } from "react-router-dom";
import meetingsAPI from "../../services/meetingsAPI";
import notificationsAPI from "../../services/notificationsAPI";
import { useNotifications } from "../../contexts/NotificationsContext";
import { API_BASE_URL } from "../../config/env";

export default function StatsGrid() {
  const navigate = useNavigate();
  const skills = useSelector(selectSkills);
  const connections = useSelector(selectConnections);
  const user = useSelector((s) => s.auth?.user);
  const { unreadCount } = useNotifications();
  const [upcomingMeetingsCount, setUpcomingMeetingsCount] = useState(0);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [availabilitySlotsCount, setAvailabilitySlotsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const skillLength = skills ? skills.length : 0;

  useEffect(() => {
    if (user?.id) {
      loadStats();
    }
  }, [user?.id]);

  const loadStats = async () => {
    setLoading(true);
    try {
      // Load upcoming meetings count
      const meetingsRes = await meetingsAPI.getMyMeetings('scheduled');
      const meetings = meetingsRes?.meetings || [];
      const now = new Date();
      const upcoming = meetings.filter(meeting => {
        const startTime = new Date(meeting.startTime);
        return startTime > now;
      });
      setUpcomingMeetingsCount(upcoming.length);

      // Load pending requests count
      const base = API_BASE_URL;
      const [recRes, sentRes] = await Promise.all([
        fetch(`${base}/connection-requests/received`, { credentials: 'include' }),
        fetch(`${base}/connection-requests/sent`, { credentials: 'include' }),
      ]);
      if (recRes.ok && sentRes.ok) {
        const recJson = await recRes.json();
        const sentJson = await sentRes.json();
        const received = recJson.data || [];
        const sent = sentJson.data || [];
        const pending = [...received, ...sent].filter(r => r.status === 'pending');
        setPendingRequestsCount(pending.length);
      }

      // Load availability slots count
      const availRes = await fetch(`${base}/availability/${user.id}`, { credentials: 'include' });
      if (availRes.ok) {
        const availJson = await availRes.json();
        const availability = availJson?.availability || [];
        const futureSlots = availability.filter(slot => {
          const startTime = new Date(slot.startTime);
          return startTime > now && !slot.isBooked;
        });
        setAvailabilitySlotsCount(futureSlots.length);
      }
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    { icon: "📚", title: "My Skills", value: skillLength, label: "Active skills", onClick: () => navigate("/dashboard/skills") },
    { icon: "👥", title: "Connections", value: connections.length, label: "Active connections", onClick: () => navigate("/dashboard/contact-requests") },
    { icon: "📅", title: "Upcoming Meetings", value: loading ? "..." : upcomingMeetingsCount, label: "Next 7 days", onClick: () => navigate("/dashboard/notifications") },
    { icon: "⏳", title: "Pending Requests", value: loading ? "..." : pendingRequestsCount, label: "Awaiting response", onClick: () => navigate("/dashboard/contact-requests") },
    { icon: "🕐", title: "Availability Slots", value: loading ? "..." : availabilitySlotsCount, label: "Available slots", onClick: () => navigate("/dashboard/availability") },
    { icon: "🔔", title: "Notifications", value: loading ? "..." : unreadCount, label: "Unread notifications", onClick: () => navigate("/dashboard/notifications") },
  ];

  return (
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
  );
}
