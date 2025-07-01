import style from './Footer.module.scss'
import FooterLogo from './FooterLogo'
import FooterSection from './FooterSection'
import Logo from '../utils/Logo';

function Footer() {
  return (
    <footer className={style.footer}>
      <div className={style.div}>
           <FooterSection/>
           <FooterSection/>
           <FooterSection/>
           <FooterSection/>
      </div>
      <div className={style.div}>
          <Logo size={'large'} link={false}/> 
      </div>
    </footer>
  )
}

export default Footer