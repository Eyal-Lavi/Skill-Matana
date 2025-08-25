import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSelectors";
import style from "./DashboardHeader.module.scss";

export default function DashboardHeader() {
  const user = useSelector(selectUser);

  return (
    <div className={style.header}>
      <h1>Welcome back, {user?.firstName || 'User'}!</h1>
      <p>Here's what's happening with your skills today</p>
    </div>
  );
}
