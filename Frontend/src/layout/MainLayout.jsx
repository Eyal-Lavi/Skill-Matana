import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import styles from "./MainLayout.module.scss";

const MainLayout = () => {
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