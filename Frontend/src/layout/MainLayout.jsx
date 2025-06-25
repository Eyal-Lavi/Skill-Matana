import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import styles from "./MainLayout.module.scss";
import { useEffect, useState } from "react";
import authAPI from "../features/auth/AuthAPI";
import { useDispatch } from "react-redux";
import { authActions } from "../features/auth/AuthSlices";

const MainLayout = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await authAPI.checkSession();
        if (response.isAuthenticated) {
          dispatch(authActions.login(response.user));
        } else {
          dispatch(authActions.logout());
        }
      } catch (error) {
        console.error("<--> Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [dispatch]);

  if (loading) return <div>Loading...</div>; 

  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.mainContent}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
