import style from './Footer.module.scss'
import FooterLogo from './FooterLogo'
import FooterSection from './FooterSection'
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
          <FooterLogo src={'https://shorturl.at/AO2SW'} alt={'logo'}/>
          <FooterLogo src={'https://shorturl.at/AO2SW'} alt={'logo'}/>
          <FooterLogo src={'https://shorturl.at/AO2SW'} alt={'logo'}/>
          <FooterLogo src={'https://shorturl.at/AO2SW'} alt={'logo'}/>
      </div>
    </footer>
  )
}

export default Footer