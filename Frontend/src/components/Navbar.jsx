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

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropDownStatus, setDropDownStatus] = useState(false);
  const [error, setError] = useState([]);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);
  const user = useSelector(selectUser);

  const toggleDropDown = () => {
    setDropDownStatus((prevStatus) => !prevStatus);
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
          <NavLink className={style.logoLink} to="/">
            Skill Matana
          </NavLink>
        </div>

        <div className={style.buttonsContainer}>
          <StyledNavLink to="/">Home</StyledNavLink>
          {isAuthenticated && (
            <StyledNavLink to="/dashboard">Dashboard</StyledNavLink>
          )}
          {isAdmin && <StyledNavLink to="/admin">Admin Panel</StyledNavLink>}
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
      </div>
    </nav>
  );
}
