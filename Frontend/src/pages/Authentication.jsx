import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import InfoPanel from "../features/auth/InfoPanel";
import styles from "./Authentication.module.scss";

const Authentication = () => {
  const location = useLocation();

  const isLoginPage = location.pathname === "/auth/login";

  const variants = {
    initial: {
      x: isLoginPage ? 50 : -50,
      opacity: 0,
    },
    animate: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: isLoginPage ? -50 : 50,
      opacity: 0,
    },
  };

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={location.pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.5 }}
      >
        <div
          className={
            isLoginPage ? styles.loginContainer : styles.registerContainer
          }
        >
          <InfoPanel />
          <Outlet />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Authentication;
