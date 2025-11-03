import StyledLink from '../utils/components/StyledLink';
import style from './FooterLinkItem.module.scss';

function FooterLinkItem({ to, children, isExternal = false }) {
  if (isExternal) {
    return (
      <li>
        <a href={to} className={style.link} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      </li>
    );
  }

  return (
    <li>
      <StyledLink to={to}>{children}</StyledLink>
    </li>
  );
}

export default FooterLinkItem