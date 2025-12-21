import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import styles from "./MainLayout.module.scss";
import { useEffect, useState } from "react";
import authAPI from "../features/auth/AuthAPI";
import { useDispatch } from "react-redux";
import { authActions } from "../features/auth/AuthSlices";
import MetaDataAPI from "../features/metaData/metaDataAPI";
import { metaDataActions } from "../features/metaData/MetaDataSlices";
import AccessibilityWidget from "../components/AccessibilityWidget/AccessibilityWidget";

const MainLayout = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await authAPI.checkSession();
        if (response.isAuthenticated) {
          dispatch(authActions.updateFromSession(response.user));

          try{
            const metaDataResponse = await MetaDataAPI.metaData();
            dispatch(metaDataActions.set(metaDataResponse));
          }catch(error){
            console.log(error);
            
            dispatch(metaDataActions.set({
              skills: [
                {id:1 , name:"JavaScript"},
                {id:2 , name:"Python"},
                {id:3 , name:"Math"},
                {id:4 , name:"SQL"},
              ]
            }));
          }
          
          
        } else {
          dispatch(authActions.logout());
        }
      } catch (error) {
        console.error("<--> Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };
    const getSkills = async () => {
      try {
        const response = await authAPI.checkSession();
        if (response.isAuthenticated) {
          dispatch(authActions.updateFromSession(response.user));
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
      <AccessibilityWidget />
    </div>
  );
};

export default MainLayout;
