import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import NavButtonLink from '../utils/NavButtonLink';
import StyledNavLink from '../utils/StyledNavLink';
import style from './Navbar.module.scss';

export default function Navbar() {
  const [dropDownStatus, setDropDownStatus] = useState(false);

  const toggleDropDown = () => {
    setDropDownStatus(prevStatus => !prevStatus);
  };

  return (
    <nav className={style.mainNav}>
      <div className={style.wrapper}>
        
        <div className={style.logoContainer}>
          <NavLink className={style.logoLink} to="/">Skill Matana</NavLink>
        </div>

        <div className={style.buttonsContainer}>
          <StyledNavLink to="/">Home</StyledNavLink>
          <StyledNavLink to="/dashboard">Dashboard</StyledNavLink>
          <NavButtonLink to="/auth/login">Login</NavButtonLink>
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
