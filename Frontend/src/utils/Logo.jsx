import { NavLink } from "react-router-dom";
import classNames from "classnames";
import styles from "./Logo.module.scss";

export default function Logo({ size = "medium", link = true }) {
  const logoImg = (
    <img
      src="/skill-matana-logo-transparent.png"
      alt="Skill Matana logo"
      className={classNames(styles.logoImage, styles[size])}
    />
  );

  return link ? (
    <NavLink className={styles.logoLink} to="/">
      {logoImg}
    </NavLink>
  ) : (
    logoImg
  );
}
