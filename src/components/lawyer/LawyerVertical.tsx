import React from 'react'
import styles from './lawyer-vertical.module.scss'
import Tag from '../tag/Tag'
import { blog, instagram, youtube } from '@/assets/imgs'
import ImageSlider from '../slider/imageSlider'
import Button from '../button/Button'
import SvgIcon from '../SvgIcon'
import { SocialLink, Tag as TagType } from '@/types/lawyerTypes'

type LawyerVerticalProps = {
  name: string
  lawfirm?: string
  profileImage: string | string[]
  type: 1 | 2 | 3
  blogUrl?: string
  youtubeUrl?: string
  instagramUrl?: string
  shareHandler?: () => void
  saveHandler?: () => void
  tags?: TagType[]
  footer?: React.ReactNode
  profileImageWidth?: string | number
  profileImageHeight?: string | number
  className?: string
  socialLink?: SocialLink[]
}

const LawyerVertical = ({
  name,
  lawfirm,
  profileImage,
  type = 3,
  blogUrl,
  youtubeUrl,
  instagramUrl,
  tags,
  footer,
  className,
  profileImageWidth,
  profileImageHeight,
}: LawyerVerticalProps) => {
  return (
    <div className={`${styles['lawyer-vertical']} ${styles[`type-${type}`]} ${className}`}>
      {type === 2 ? (
        <ImageSlider
          images={profileImage as string[]}
          sliderSettings={{ arrows: false, infinite: false }}
          width={profileImageWidth}
          height={profileImageHeight}
          customDots={true}
        />
      ) : (
        <img src={profileImage as string} alt='변호사 프로필' style={{ borderRadius: 100, objectFit: 'cover' }} />
      )}
      <div className={styles['lawyer-info']}>
        <p className={styles.name}>{name} 변호사</p>
        {lawfirm && <p className={styles.lawfirm}>{lawfirm}</p>}
        <div className={styles['button-wrapper']}>
          <Button variant='share'>
            공유
            <SvgIcon name='share' size={16} />
          </Button>
          <Button variant='save'>
            저장 <SvgIcon name='save' size={16} />
          </Button>
        </div>
      </div>
      {type === 2 && <button className={styles['baro-talk-button']}>바로 톡</button>}
      <div className={styles['social-link']}>
        {blogUrl && (
          <img
            src={blog}
            alt='블로그'
            className={styles['social-link-img']}
            onClick={() => window.open(blogUrl, '_blank')}
          />
        )}
        {youtubeUrl && (
          <img
            src={youtube}
            alt='유튜브'
            className={styles['social-link-img']}
            onClick={() => window.open(youtubeUrl, '_blank')}
          />
        )}
        {instagramUrl && (
          <img
            src={instagram}
            alt='인스타그램'
            className={styles['social-link-img']}
            onClick={() => window.open(instagramUrl, '_blank')}
          />
        )}

        {tags && (
          <div className={styles['tag-list']}>
            {tags.map(tagItem => (
              <Tag tag={tagItem.name} key={tagItem.id} />
            ))}
          </div>
        )}
      </div>
      <footer>{footer}</footer>
    </div>
  )
}

export default LawyerVertical
