import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './TermsPrivacy.module.scss';

function TermsPrivacy() {
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
    <div className={styles.termsPrivacy}>
      <div className={styles.container}>
        <section className={styles.hero}>
          <h1>Terms of Service & Privacy Policy</h1>
          <p className={styles.subtitle}>
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </section>

        <section className={styles.section}>
          <h2>Terms of Service</h2>
          
          <div className={styles.contentBlock}>
            <h3>1. Acceptance of Terms</h3>
            <p>
              By accessing and using Skill Matana, you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to abide by the above, please 
              do not use this service.
            </p>
          </div>

          <div className={styles.contentBlock}>
            <h3>2. Use License</h3>
            <p>
              Permission is granted to temporarily use Skill Matana for personal, non-commercial 
              transitory viewing only. This is the grant of a license, not a transfer of title, 
              and under this license you may not:
            </p>
            <ul>
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software contained on Skill Matana</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </div>

          <div className={styles.contentBlock}>
            <h3>3. User Accounts</h3>
            <p>
              You are responsible for maintaining the confidentiality of your account and password. 
              You agree to accept responsibility for all activities that occur under your account 
              or password.
            </p>
          </div>

          <div className={styles.contentBlock}>
            <h3>4. User Conduct</h3>
            <p>
              You agree to use Skill Matana only for lawful purposes and in a way that does not 
              infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the 
              platform. Prohibited behavior includes:
            </p>
            <ul>
              <li>Harassing, abusing, or harming other users</li>
              <li>Posting false, misleading, or fraudulent information</li>
              <li>Violating any applicable laws or regulations</li>
              <li>Interfering with or disrupting the platform's functionality</li>
            </ul>
          </div>

          <div className={styles.contentBlock}>
            <h3>5. Intellectual Property</h3>
            <p>
              The content, organization, graphics, design, compilation, and other matters related 
              to Skill Matana are protected under applicable copyrights, trademarks, and other 
              proprietary rights. You may not copy, reproduce, distribute, or create derivative 
              works without our prior written consent.
            </p>
          </div>

          <div className={styles.contentBlock}>
            <h3>6. Limitation of Liability</h3>
            <p>
              Skill Matana shall not be liable for any indirect, incidental, special, consequential, 
              or punitive damages resulting from your use of or inability to use the service.
            </p>
          </div>

          <div className={styles.contentBlock}>
            <h3>7. Changes to Terms</h3>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of any 
              significant changes by posting the new terms on this page.
            </p>
          </div>
        </section>

        <section id="privacy" className={styles.section}>
          <h2>Privacy Policy</h2>
          
          <div className={styles.contentBlock}>
            <h3>1. Information We Collect</h3>
            <p>
              We collect information that you provide directly to us, including:
            </p>
            <ul>
              <li>Account information (name, email address, profile information)</li>
              <li>Skills and interests you list on your profile</li>
              <li>Messages and communications sent through the platform</li>
              <li>Usage data and analytics when you interact with our service</li>
            </ul>
          </div>

          <div className={styles.contentBlock}>
            <h3>2. How We Use Your Information</h3>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Match you with other users based on skills and interests</li>
              <li>Send you notifications and updates about your account</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Detect, prevent, and address technical issues and security threats</li>
            </ul>
          </div>

          <div className={styles.contentBlock}>
            <h3>3. Information Sharing</h3>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may 
              share your information only in the following circumstances:
            </p>
            <ul>
              <li>With your consent or at your direction</li>
              <li>To comply with legal obligations or respond to legal requests</li>
              <li>To protect the rights, property, or safety of Skill Matana, our users, or others</li>
              <li>With service providers who assist us in operating our platform</li>
            </ul>
          </div>

          <div className={styles.contentBlock}>
            <h3>4. Data Security</h3>
            <p>
              We implement appropriate technical and organizational measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction. 
              However, no method of transmission over the Internet is 100% secure.
            </p>
          </div>

          <div className={styles.contentBlock}>
            <h3>5. Your Rights</h3>
            <p>You have the right to:</p>
            <ul>
              <li>Access and receive a copy of your personal data</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Request deletion of your personal data</li>
              <li>Object to or restrict processing of your information</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </div>

          <div className={styles.contentBlock}>
            <h3>6. Cookies and Tracking</h3>
            <p>
              We use cookies and similar tracking technologies to track activity on our platform 
              and hold certain information. You can instruct your browser to refuse all cookies 
              or to indicate when a cookie is being sent.
            </p>
          </div>

          <div className={styles.contentBlock}>
            <h3>7. Changes to Privacy Policy</h3>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes 
              by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </div>

          <div className={styles.contentBlock}>
            <h3>8. Contact Us</h3>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className={styles.contact}>
              Email: <a href="mailto:skillmatana@gmail.com">skillmatana@gmail.com</a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default TermsPrivacy;

