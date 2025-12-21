import React from "react";
import styles from "./InfoPanel.module.scss";
import { useLocation } from "react-router-dom";

const InfoPanel = () => {
  const { pathname } = useLocation();
  const isLoginPage = pathname === "/auth/login";

  const loginFeatures = [
    { icon: "🚀", text: "Quick access to your learning dashboard" },
    { icon: "📊", text: "Track your skill progress in real-time" },
    { icon: "🤝", text: "Connect with mentors and learners" },
  ];

  const registerFeatures = [
    { icon: "✨", text: "Personalized learning paths" },
    { icon: "🎯", text: "Match with skilled mentors" },
    { icon: "🏆", text: "Earn badges and recognition" },
  ];

  const features = isLoginPage ? loginFeatures : registerFeatures;

  return (
    <div className={`${styles.panel} ${isLoginPage ? styles.loginPanel : styles.registerPanel}`}>
      {/* Animated background elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.orb1}></div>
        <div className={styles.orb2}></div>
        <div className={styles.orb3}></div>
        <div className={styles.gridPattern}></div>
      </div>

      {/* Floating shapes */}
      <div className={styles.floatingShapes}>
        <div className={styles.shape1}></div>
        <div className={styles.shape2}></div>
        <div className={styles.shape3}></div>
        <div className={styles.shape4}></div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Icon/Logo area */}
        <div className={styles.iconWrapper}>
          <div className={styles.mainIcon}>
            {isLoginPage ? (
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
              </svg>
            ) : (
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M19 8v6M22 11h-6" />
              </svg>
            )}
          </div>
          <div className={styles.iconGlow}></div>
        </div>

        {/* Text content */}
        <h1 className={styles.title}>
          {isLoginPage ? "Welcome Back!" : "Join Our Community"}
        </h1>
        <p className={styles.subtitle}>
          {isLoginPage
            ? "We're excited to see you again. Your learning journey awaits."
            : "Start your journey of knowledge sharing and skill development."}
        </p>

        {/* Feature list */}
        <div className={styles.features}>
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={styles.featureItem}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <span className={styles.featureIcon}>{feature.icon}</span>
              <span className={styles.featureText}>{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Stats or social proof */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>10K+</span>
            <span className={styles.statLabel}>Learners</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>500+</span>
            <span className={styles.statLabel}>Skills</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>50K+</span>
            <span className={styles.statLabel}>Sessions</span>
          </div>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className={styles.bottomWave}>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".15"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".3"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,googl172.46-45.71,248.8-84.81V0Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default InfoPanel;
