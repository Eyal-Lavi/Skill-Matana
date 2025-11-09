import {
  DashboardHeader,
  StatsGrid,
  RecentActivity,
  UpcomingMeetings,
  QuickActions,
  NotificationsPreview
} from "../components/dashboard";
import style from "./Dashboard.module.scss";

function Dashboard() {
  return (
    <div className={style.dashboard}>
      <DashboardHeader />
      <StatsGrid />
      <div className={style.dashboardContent}>
        <div className={style.leftColumn}>
          <UpcomingMeetings />
          <NotificationsPreview />
        </div>
        <div className={style.rightColumn}>
          <QuickActions />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;