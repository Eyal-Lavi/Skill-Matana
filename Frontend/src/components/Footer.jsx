import style from './Footer.module.scss';
import FooterSection from './FooterSection';
import Logo from '../utils/components/Logo';

function Footer() {
  return (
    <footer className={style.footer}>
      <div className={style.content}>
        <div className={style.sections}>
          <FooterSection 
            title="About"
            links={[
              { to: '/about', label: 'About Us' },
              { to: '/about#mission', label: 'Our Mission' },
              { to: '/about#how-it-works', label: 'How It Works' },
            ]}
          />
          <FooterSection 
            title="Legal"
            links={[
              { to: '/terms-privacy', label: 'Terms of Service' },
              { to: '/terms-privacy#privacy', label: 'Privacy Policy' },
            ]}
          />
        </div>
        <div className={style.logoSection}>
          <Logo size={'large'} link={false}/> 
          <p className={style.copyright}>
            © {new Date().getFullYear()} Skill Matana. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer