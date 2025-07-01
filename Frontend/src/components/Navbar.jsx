import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import NavButtonLink from "../utils/NavButtonLink";
import StyledNavLink from "../utils/StyledNavLink";
import style from "./Navbar.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  selectIsAdmin,
  selectUser,
} from "../features/auth/authSelectors";
import authAPI from "../features/auth/AuthAPI";
import { authActions } from "../features/auth/AuthSlices";
import Logo from "../utils/Logo";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropDownStatus, setDropDownStatus] = useState(false);
  const [error, setError] = useState([]);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);
  const user = useSelector(selectUser);

  const toggleDropDown = (value) => {
    setDropDownStatus((prevStatus) => !prevStatus);
  };
  const handleNavClick = () => {
    setDropDownStatus(false);
  };
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await authAPI.logout();
      dispatch(authActions.logout());
      navigate("/");
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      setError(errorMessage || "Login failed");
      console.log(errorMessage || "Login failed");
    }
  };
  return (
    <nav className={style.mainNav}>
      <div className={style.wrapper}>
        <div className={style.logoContainer}>
          <Logo size="large" />
        </div>

        <div className={style.buttonsContainer}>
          <StyledNavLink onClick={handleNavClick} to="/">Home</StyledNavLink>
          {
            isAuthenticated && 
            <>
              <StyledNavLink onClick={handleNavClick} to="/dashboard">Dashboard</StyledNavLink>
              <StyledNavLink onClick={handleNavClick} to="/profile">Profile</StyledNavLink>
            </>
          }
          {isAdmin && <StyledNavLink onClick={handleNavClick} to="/admin">Admin Panel</StyledNavLink>}
          {isAuthenticated ? (
            <button onClick={handleLogout} className={style.logoutButton}>
              Logout
            </button>
          ) : (
            <NavButtonLink to="/auth/login">Login</NavButtonLink>
          )}
        </div>

        <FontAwesomeIcon
          onClick={toggleDropDown}
          className={style.dropDownButton}
          icon={!dropDownStatus ? faBars : faXmark}
          size="2x"
        />

        {dropDownStatus && (
  <div className={style.mobileMenu}>
    <StyledNavLink onClick={handleNavClick} to="/">Home</StyledNavLink>
    {isAuthenticated && (
      <>
        <StyledNavLink onClick={handleNavClick} to="/dashboard">Dashboard</StyledNavLink>
        <StyledNavLink onClick={handleNavClick} to="/profile">Profile</StyledNavLink>
      </>
    )}
    {isAdmin && <StyledNavLink onClick={handleNavClick} to="/admin">Admin Panel</StyledNavLink>}
    {isAuthenticated ? (
      <button onClick={handleLogout} className={style.logoutButton}>
        Logout
      </button>
    ) : (
      <NavButtonLink onClick={handleNavClick} to="/auth/login">Login</NavButtonLink>
    )}
  </div>
)}

      </div>
    </nav>
  );
}
