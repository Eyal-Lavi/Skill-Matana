import { Outlet } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import style from "./DashboardLayout.module.scss";

export default function DashboardLayout() {
  return (
    <div className={style.dashboardLayout}>
      <DashboardSidebar />
      <main className={style.mainContent}>
        <Outlet />
      </main>
    </div>
  );
}
