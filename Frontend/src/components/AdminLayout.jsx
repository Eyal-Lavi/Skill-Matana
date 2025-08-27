import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import style from "./AdminLayout.module.scss";

export default function AdminLayout() {
  return (
    <div className={style.adminLayout}>
      <AdminSidebar />
      <main className={style.mainContent}>
        <Outlet />
    </main>
    </div>
  );
}
