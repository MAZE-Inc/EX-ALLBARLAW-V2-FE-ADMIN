import styles from './blogItem.module.scss'
// import { useState } from 'react'
import { BlogCase } from '@/types/blogTypes'

type BlogItemProps = {
  item: BlogCase
  className?: string
  onClick?: () => void
}

const BlogItem = ({ item, className, onClick }: BlogItemProps) => {
  return (
    <article className={`${styles['blog-item-wrapper']} ${className}`} onClick={onClick}>
      <div className={styles['blog-item']}>
        <div className={styles['blog-content-header']}>
          <h3>{item.title}</h3>
          {/* {isLoggedIn && !isMobile && isShowKeep && (
            <SvgIcon name='bookMark' onClick={() => setLike(!like)} fill={like ? COLOR.green_01 : 'none'} />
          )} */}
        </div>
        <div className={styles['blog-content-body']}>
          <p>{item.summaryContent}</p>
          <div className={styles['blog-content-footer']}>
            <span className={styles.lawyer}>{item.lawyerName} 변호사</span>
            <span className={styles.lawfirm}>[{item.lawfirmName}]</span>

            {/* <SvgIcon
              name='bookMark'
              onClick={() => setLike(!like)}
              fill={like ? C : 'none'}
              style={{ marginLeft: 'auto' }}
            /> */}
          </div>
        </div>
      </div>
      <figure>
        <img
          className={styles['blog-item-img']}
          src={item.thumbnail}
          alt='blog-item-image'
          referrerPolicy='no-referrer'
        />
      </figure>
    </article>
  )
}

export default BlogItem
