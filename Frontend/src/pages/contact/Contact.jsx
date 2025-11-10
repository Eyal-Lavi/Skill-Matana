import { useState } from 'react';
import styles from './Contact.module.scss';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create mailto link with form data
    const email = 'skillmatana@gmail.com';
    const subject = encodeURIComponent(formData.subject || 'Contact from Skill Matana');
    const body = encodeURIComponent(
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n\n` +
      `Message:\n${formData.message}`
    );
    
    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    setStatus({
      type: 'success',
      message: 'Your email client should open. If it doesn\'t, please send an email to skillmatana@gmail.com'
    });
    
    // Reset form after a delay
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setStatus({ type: '', message: '' });
    }, 5000);
  };

  return (
    <div className={styles.contact}>
      <div className={styles.container}>
        <section className={styles.hero}>
          <h1>Contact Us</h1>
          <p className={styles.subtitle}>
            Have a question, suggestion, or need support? We'd love to hear from you!
          </p>
        </section>

        <div className={styles.content}>
          <div className={styles.info}>
            <div className={styles.infoCard}>
              <h3>Get in Touch</h3>
              <p>
                We're here to help! Whether you have questions about our platform, need technical 
                support, or want to share feedback, we're just an email away.
              </p>
              
              <div className={styles.contactMethod}>
                <h4>Email Us</h4>
                <a href="mailto:skillmatana@gmail.com" className={styles.emailLink}>
                  skillmatana@gmail.com
                </a>
              </div>
              
              <div className={styles.contactMethod}>
                <h4>Response Time</h4>
                <p>We typically respond within 24-48 hours.</p>
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h2>Send Us a Message</h2>
            <p className={styles.formDescription}>
              Fill out the form below and we'll open your email client with a pre-filled message. 
              Just click send when you're ready!
            </p>
            
            {status.message && (
              <div className={`${styles.status} ${styles[status.type]}`}>
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Your Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="What's this about?"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Tell us how we can help..."
                />
              </div>

              <button type="submit" className={styles.submitButton}>
                Open Email Client
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;

