import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './About.module.scss';

function About() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className={styles.about}>
      <div className={styles.container}>
        <section className={styles.hero}>
          <h1>About Skill Matana</h1>
          <p className={styles.subtitle}>
            Connecting people through knowledge and shared learning experiences
          </p>
        </section>

        <section id="mission" className={styles.section}>
          <h2>Our Mission</h2>
          <p>
            At Skill Matana, we believe that everyone has something valuable to teach and 
            something meaningful to learn. Our mission is to create a vibrant community where 
            people can connect, share their expertise, and grow together through mutual learning.
          </p>
          <p>
            We envision a world where knowledge flows freely, where barriers to learning are 
            removed, and where every individual can access the skills they need while contributing 
            their own unique talents to the community.
          </p>
        </section>

        <section id="how-it-works" className={styles.section}>
          <h2>How It Works</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h3>Create Your Profile</h3>
              <p>
                Sign up and build your profile by listing the skills you want to learn and 
                the skills you can teach. Share your interests, availability, and what makes 
                you unique.
              </p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h3>Find Your Match</h3>
              <p>
                Discover users who complement your learning goals. Our platform helps you find 
                people who want to learn what you can teach and who can teach what you want to learn.
              </p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h3>Connect & Learn</h3>
              <p>
                Send connection requests, schedule learning sessions, and start your journey 
                of mutual growth. Exchange knowledge, build relationships, and learn together.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Why Skill Matana?</h2>
          <div className={styles.features}>
            <div className={styles.feature}>
              <h3>Mutual Learning</h3>
              <p>
                Every interaction is a two-way exchange. You teach while you learn, creating 
                a balanced and enriching experience for everyone.
              </p>
            </div>
            <div className={styles.feature}>
              <h3>Community-Driven</h3>
              <p>
                Built by learners, for learners. Our platform grows and evolves with the 
                needs and contributions of our community.
              </p>
            </div>
            <div className={styles.feature}>
              <h3>Accessible Learning</h3>
              <p>
                Break down traditional barriers to education. Learn from real people, in real 
                time, at your own pace, and in a way that works for you.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Join Us</h2>
          <p>
            Ready to start your learning journey? Whether you're looking to pick up a new skill, 
            share your expertise, or both, Skill Matana is here to help you connect with amazing 
            people and grow together.
          </p>
          <div className={styles.cta}>
            <a href="/auth/register" className={styles.button}>
              Get Started Today
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;

