import React, { useEffect, useMemo, useState } from "react";
import {
  Twitter,
  Github,
  Instagram,
  Linkedin,
  ArrowUpRight,
} from "lucide-react";
import "./ProfileCard.scss";
import Tooltip from "../../utils/components/Tooltip/Tooltip";
import Tag from "../../utils/components/Tag/Tag";

export default function ProfileCard({
  avatarUrl = "https://vucvdpamtrjkzmubwlts.supabase.co/storage/v1/object/public/users/user_2zMtrqo9RMaaIn4f8F2z3oeY497/avatar.png",
  name = "Default User",
  title = "Developer",
  skills = [
    { id: "1000", name: "No skills" },
    { id: "1000", name: "No skills" },
  ],
  bio: _bio = "Building beautiful and intuitive digital experiences. Passionate about design systems and web animation.",
  socialLinks = [
    { id: "github", icon: Github, label: "GitHub", href: "#" },
    { id: "instagram", icon: Instagram, label: "Instagram", href: "#" },
    { id: "linkedin", icon: Linkedin, label: "LinkedIn", href: "#" },
    { id: "twitter", icon: Twitter, label: "Twitter", href: "#" },
  ],
  actionButton = {
    text: "Contact Me",
    onClick: () => {},
  },
  extraActions = [],
}) {
  const [hoveredItem, setHoveredItem] = useState(null);

  const safeName = useMemo(() => (typeof name === "string" ? name.trim() : ""), [name]);
  const avatarInitial = useMemo(() => {
    const ch = safeName?.[0] || "?";
    return ch.toUpperCase();
  }, [safeName]);

  const fallbackAvatarSrc = useMemo(() => {
    const text = encodeURIComponent(avatarInitial);
    return `https://placehold.co/96x96/6366f1/white?text=${text}`;
  }, [avatarInitial]);

  const resolvedAvatarSrc = useMemo(() => {
    const url = typeof avatarUrl === "string" ? avatarUrl.trim() : "";
    return url ? url : fallbackAvatarSrc;
  }, [avatarUrl, fallbackAvatarSrc]);

  const [imgSrc, setImgSrc] = useState(resolvedAvatarSrc);

  useEffect(() => {
    setImgSrc(resolvedAvatarSrc);
  }, [resolvedAvatarSrc]);

  return (
    <div className="profile-card-container">
      <div className="profile-card">
        <div className="avatar-container">
          <img
            src={imgSrc}
            alt=""
            aria-label={`${safeName || "User"} avatar`}
            className="avatar"
            onError={(e) => {
              // Prevent showing alt text / broken image when src is missing or invalid.
              // Fall back to a deterministic placeholder based on the user's initial.
              e.currentTarget.onerror = null;
              setImgSrc(fallbackAvatarSrc);
            }}
          />
        </div>
        <h2 className="name">{name}</h2>
        <p className="title">{title}</p>
        {skills && skills.length > 0 && (
          <div className="skills-container">
            {skills.map((skill, index) => (
              <Tag key={index} label={skill.name} />
            ))}
          </div>
        )}
        {/* <p className="bio">{bio}</p> */}
        <div className="divider" />
        <div className="social-links">
          {socialLinks.map((item) => (
            <SocialButton
              key={item.id}
              item={item}
              setHoveredItem={setHoveredItem}
              hoveredItem={hoveredItem}
            />
          ))}
        </div>
        {actionButton && <ActionButton action={actionButton} />}
        {Array.isArray(extraActions) && extraActions.length > 0 && (
          <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            {extraActions.map((act, idx) => (
              <a
                key={idx}
                href={act.href}
                onClick={(e) => {
                  e.preventDefault();
                  act.onClick();
                }}
                className={`action-button${act?.variant ? ` action-button--${act.variant}` : ""}`}
                style={{ padding: '8px 12px' }}
              >
                <span>{act.text}</span>
              </a>
            ))}
          </div>
        )}
      </div>
      <div className="card-glow" />
    </div>
  );
}

const SocialButton = ({ item, setHoveredItem, hoveredItem }) => (
  <div className="social-button-wrapper">
    <a
      href={item.href}
      onClick={(e) => e.preventDefault()}
      className="social-button"
      onMouseEnter={() => setHoveredItem(item.id)}
      onMouseLeave={() => setHoveredItem(null)}
      aria-label={item.label}
    >
      <div className="icon-wrapper">
        <item.icon size={20} className="icon" />
      </div>
    </a>
    <Tooltip item={item} hoveredItem={hoveredItem} />
  </div>
);

const ActionButton = ({ action }) => (
  <a
    href={action.href}
    onClick={(e) => {
      e.preventDefault();
      action.onClick();
    }}
    className={`action-button${action?.variant ? ` action-button--${action.variant}` : ""}`}
  >
    <span>{action.text}</span>
    <ArrowUpRight size={16} className="arrow-icon" />
  </a>
);
