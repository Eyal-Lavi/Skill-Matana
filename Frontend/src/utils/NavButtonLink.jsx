import { NavLink } from 'react-router-dom';
import styles from './NavButtonLink.module.scss';

const NavButtonLink = ({ to, children, className = '', exact = false, onClick = () => {} }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${styles.navButtonLink} ${className} ${isActive ? 'active' : ''}`
      }
      onClick={onClick}
      end={exact}
    >
      {children}
    </NavLink>
  );
};

export default NavButtonLink;
