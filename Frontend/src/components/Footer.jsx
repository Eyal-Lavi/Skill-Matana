import style from './Footer.module.scss';
import FooterSection from './FooterSection';
import Logo from '../utils/components/Logo';

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