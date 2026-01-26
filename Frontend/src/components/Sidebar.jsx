import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useRef } from "react";
import style from "./Sidebar.module.scss";

export default function Sidebar({ items, variant = "dashboard", badgeCounts = {} }) {
  const [bottomOffset, setBottomOffset] = useState(0);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      // Don't apply offset on mobile - sidebar should stay at bottom
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      if (isMobile) {
        setBottomOffset(0);
        return;
      }

      const footer = document.querySelector('footer');
      if (!footer || !sidebarRef.current) return;

      const footerRect = footer.getBoundingClientRect();
      const sidebarRect = sidebarRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // If footer is visible and would overlap with sidebar (with 10rem/160px spacing)
      const requiredSpacing = 160; // 10rem = 160px to match navbar spacing
      if (footerRect.top < viewportHeight) {
        const overlap = (sidebarRect.bottom + requiredSpacing) - footerRect.top;
        if (overlap > 0) {
          setBottomOffset(overlap);
        } else {
          setBottomOffset(0);
        }
      } else {
        setBottomOffset(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div 
      ref={sidebarRef}
      className={`${style.sidebar} ${style[variant]}`}
      style={bottomOffset > 0 ? { transform: `translateY(-${bottomOffset}px)` } : undefined}
    >
      <div className={style.sidebarContent}>
        <div className={style.navItems}>
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `${style.navItem} ${isActive ? style.active : ""}`
              }
            >
              <div className={style.iconContainer}>
                <FontAwesomeIcon icon={item.icon} className={style.icon} />
                {badgeCounts[item.path] != null && badgeCounts[item.path] > 0 && (
                  <span className={style.badge}>{badgeCounts[item.path]}</span>
                )}
              </div>
              <span className={style.label}>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
