import React from 'react'
import style from './FooterLogo.module.scss';
function FooterLogo({src , alt}) {
  return (
    <div className={style.div}>
        <img src={src} alt={alt} />
    </div>
  )
}

export default FooterLogo