import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import InfoPanel from "../../features/auth/InfoPanel";
import styles from "./Authentication.module.scss";

const Authentication = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/auth/login";

  const containerVariants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  const formVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.98,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className={isLoginPage ? styles.loginContainer : styles.registerContainer}>
          <InfoPanel />
          <motion.div 
            className={styles.formWrapper}
            variants={formVariants}
          >
            <Outlet />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Authentication;
