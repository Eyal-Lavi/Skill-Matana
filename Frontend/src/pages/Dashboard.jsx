import {
  DashboardHeader,
  StatsGrid,
  RecentActivity
} from "../components/dashboard";
import style from "./Dashboard.module.scss";

function Dashboard() {
  return (
    <div className={style.dashboard}>
      <DashboardHeader />
      <StatsGrid />
      <RecentActivity />
    </div>
  );
}

export default Dashboard;