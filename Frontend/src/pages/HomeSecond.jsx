import { Link } from "react-router-dom";
import styles from "./HomeSecond.module.scss";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../features/auth/authSelectors";
import HeroBackground from "./HomeBackground";
import { Cpu, ShieldCheck, Layers, Zap, Eye } from "lucide-react";

const features = [
  {
    icon: Cpu,
    title: "1. Sign Up",
    description: "Ultra-fast data processing in every situation.",
  },
  {
    icon: ShieldCheck,
    title: "2. Find a Match",
    description: "Create your profile and list your skills.",
  },
  {
    icon: Layers,
    title: "3. Learn Together",
    description: "Connect, schedule a session, and start growing together.",
  },
  {
    icon: Zap,
    title: "Responsiveness",
    description: "Instant response to every command.",
  },

];

export default function HomeSecond() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <div className={styles.home}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 ,top: 0, right: 0,  bottom: 0, left: 0 }}>
          <HeroBackground />
        </div>
      <section className={styles.hero}>
          <div className={styles.heroContent}>
          <h1>Learn Together – Everyone Has Something to Teach</h1>
          <p>
            Connect with people who have the skills you want to learn, and share the ones you already know. Grow through mutual learning!
          </p>
          <div className={styles.heroButtons}>
            {isAuthenticated ? (
              <Link to="/dashboard" className={styles.primaryButton}>
                Find a Match
              </Link>
            ) : (
              <>
                <Link to="/auth/register" className={styles.primaryButton}>
                  Get Started
                </Link>
                <Link to="/auth/login" className={styles.secondaryButton}>
                  I Have an Account
                </Link>
              </>
            )}
          </div>
        </div>
        {/* <img
          src="/illustration_learning_together.svg"
          alt="Learning Together Illustration"
          className={styles.heroImage}
        /> */}
      </section>

      {/* <section className={styles.steps}> */}
        <h2>How It Works</h2>
        <div className={styles.stepList}>
          {features.map((feature, idx) => (
            <div key={idx} className={styles.stepCard}>
              <feature.icon size={24} className={styles.stepIcon} />
              <h3 className={styles.stepTitle}>{feature.title}</h3>
              <p className={styles.stepDescription}>{feature.description}</p>
            </div>
          ))}
        </div>

{/* 
          <div className={styles.step}>
            <h3>1. Sign Up</h3>
            <p>Create your profile and list your skills.</p>
          </div>
          <div className={styles.step}>
            <h3>2. Find a Match</h3>
            <p>Discover users who complement your skills and interests.</p>
          </div>
          <div className={styles.step}>
            <h3>3. Learn Together</h3>
            <p>Connect, schedule a session, and start growing together.</p>
          </div> */}
      {/* </section> */}
    </div>
  );
}
