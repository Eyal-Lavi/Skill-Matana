import { NavLink } from 'react-router-dom';
import styles from './StyledNavLink.module.scss';

export default function StyledNavLink({
  to,
  children,
  className = '',
  activeClassName = styles.active,
  exact = false,
  onClick = () => {}
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${styles.navLink} ${className} ${isActive ? activeClassName : ''}`
      }
      onClick={onClick}
      end={exact}
    >
      {children}
    </NavLink>
  );
}
