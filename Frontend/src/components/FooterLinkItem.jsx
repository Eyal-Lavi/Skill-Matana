import StyledLink from '../utils/StyledLink'

function FooterLinkItem({to , children}) {
  return (
    <li>
        <StyledLink to={to}>{children}</StyledLink>
    </li>
  )
}

export default FooterLinkItem