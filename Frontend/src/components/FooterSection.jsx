import React from 'react'
import FooterLinkItem from './FooterLinkItem'
import style from './FooterSection.module.scss';

function FooterSection({ title, links = [] }) {
  return (
    <section className={style.section}>
      <h3 className={style.title}>{title}</h3>
      <ul className={style.ul}>
        {links.map((link, index) => (
          <FooterLinkItem 
            key={index} 
            to={link.to} 
            isExternal={link.isExternal}
          >
            {link.label}
          </FooterLinkItem>
        ))}
      </ul>
    </section>
  )
}

export default FooterSection