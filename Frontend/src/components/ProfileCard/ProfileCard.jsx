import React, { useState } from "react";
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
  bio = "Building beautiful and intuitive digital experiences. Passionate about design systems and web animation.",
  socialLinks = [
    { id: "github", icon: Github, label: "GitHub", href: "#" },
    { id: "instagram", icon: Instagram, label: "Instagram", href: "#" },
    { id: "linkedin", icon: Linkedin, label: "LinkedIn", href: "#" },
    { id: "twitter", icon: Twitter, label: "Twitter", href: "#" },
  ],
  actionButton = {
    text: "Contact Me",
    onClick: () => alert("Contact Me clicked!"),
  },
}) {
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <div className="profile-card-container">
      <div className="profile-card">
        <div className="avatar-container">
          <img
            src={avatarUrl}
            alt={`${name}'s Avatar`}
            className="avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/96x96/6366f1/white?text=${name.charAt(
                0
              )}`;
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
        <ActionButton action={actionButton} />
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
    className="action-button"
  >
    <span>{action.text}</span>
    <ArrowUpRight size={16} className="arrow-icon" />
  </a>
);

// const Tooltip = ({ item, hoveredItem }) => (
//   <div
//     className={`tooltip ${hoveredItem === item.id ? 'visible' : ''}`}
//     role="tooltip"
//   >
//     {item.label}
//     <div className="tooltip-arrow" />
//   </div>
// );
