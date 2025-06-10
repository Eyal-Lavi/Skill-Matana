import React from 'react'
import FooterLinkItem from './FooterLinkItem'
import style from './FooterSection.module.scss';

function FooterSection() {
  return (
    <section className={style.section}>
        <ul className={style.ul}>
            <FooterLinkItem to='/'>test</FooterLinkItem>
            <FooterLinkItem to='/'>test</FooterLinkItem>
            <FooterLinkItem to='/'>test</FooterLinkItem>
            <FooterLinkItem to='/'>test</FooterLinkItem>
        </ul>
    </section>
  )
}

export default FooterSection