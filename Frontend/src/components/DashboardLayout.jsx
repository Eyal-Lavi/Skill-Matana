import { Outlet } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import { NotificationsProvider } from "../contexts/NotificationsContext";
import style from "./DashboardLayout.module.scss";

export default function DashboardLayout() {
  return (
    <NotificationsProvider>
      <div className={style.dashboardLayout}>
        <DashboardSidebar />
        <main className={style.mainContent}>
          <Outlet />
        </main>
      </div>
    </NotificationsProvider>
  );
}
