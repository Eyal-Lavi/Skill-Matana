import React from "react";


export default function ProfileHeader({
  title = "My Profile",
  subtitle = "Manage your personal info and settings",
  children,
}) {
  return (
    <header>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        {children}
    </header>
  );
}


