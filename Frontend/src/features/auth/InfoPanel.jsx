import React from "react";
import styles from "./InfoPanel.module.scss";
import { useLocation } from "react-router-dom";

const InfoPanel = () => {
  const { pathname } = useLocation();
  const isLoginPage = pathname === "/auth/login";

  return (
    <div className={isLoginPage ? styles.rightSide : styles.leftSide}>
      <h1 className={styles.title}>
        {isLoginPage ? "Welcome to the Login Page" : "Welcome to the Register Page"}
      </h1>
      <p className={styles.text}>
        {isLoginPage
          ? "Please enter your credentials to log in."
          : "Please fill out the form to create your account."}
      </p>
    </div>
  );
};

export default InfoPanel;
