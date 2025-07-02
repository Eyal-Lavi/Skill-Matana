import { Link } from 'react-router-dom';
import style from './StyledLink.module.scss';
export default function StyledNavLink({
  to,
  children,
  className = '',
  onClick = () => {}
}) {
  return (
    <Link
      to={to}
      className={className ? className : style.link}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
