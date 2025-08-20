import styles from '@/components/lawyer/lawyer-horizon.module.scss'
import Tag from '../tag/Tag'
import React from 'react'
import { SocialLink, Tag as TagType } from '@/types/lawyerTypes'
import { blog, instagram, youtube } from '@/assets/imgs'

type LawyerHorizonProps = {
  name: string
  profileImage: string
  description?: string
  lawfirm?: string
  tags?: TagType[]
  socialLink?: SocialLink[]
  size?: 'x-small' | 'small' | 'large'
  className?: string
  onClick?: () => void
  selected?: boolean
  buttonComponent?: React.ReactNode
  ad?: boolean
  isBaroTalk?: boolean
  lawyerId?: number
}

const LawyerHorizon = ({
  name,
  profileImage,
  description,
  lawfirm,
  tags,
  isBaroTalk = false,
  size = 'small',
  className,
  onClick,
  selected = false,
  buttonComponent,
  ad = false,
  lawyerId,
  socialLink,
}: LawyerHorizonProps) => {
  // const navigate = useNavigate()
  const handleBaroTalk = (e: React.MouseEvent) => {
    e.stopPropagation() // 이벤트 버블링 방지
    if (lawyerId) {
      // setTemporaryItem(LOCAL.CHAT_SELECTED_LAWYER_ID, lawyerId.toString(), 30) // 30분 유효
      // navigate(ROUTER.REQUEST_BARO_TALK)
    }
  }

  return (
    <div
      className={`${styles['lawyer-horizon']} ${styles[size]} ${selected ? styles['selected'] : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className={styles['lawyer-horizon-image']}>
        <img src={profileImage} alt='변호사 프로필' />
        {/* {selected && <SvgIcon name='checkRound' size={16} fill={COLOR.green_01} stroke={COLOR.white} />} */}
        {isBaroTalk && (
          <button className={styles['baro-talk']} onClick={handleBaroTalk}>
            바로톡
          </button>
        )}
      </div>
      <div className={styles['lawyer-horizon-content']}>
        <div>
          <span className={styles['name']}>{name} 변호사</span>
          {lawfirm && <span className={styles['lawfirm']}>{lawfirm}</span>}
          {ad && <span className={styles['ad']}>AD</span>}
        </div>
        {description && <p className={styles['description']}>{description}</p>}

        {tags && tags.length > 0 && (
          <div className={styles['tags']}>
            {tags.map((tag, index) => (
              <Tag key={index} tag={tag.name} />
            ))}
          </div>
        )}

        {socialLink && (
          <div className={styles['social-link']}>
            <img src={blog} alt='블로그' className={styles['social-link-img']} />
            <img src={youtube} alt='유튜브' className={styles['social-link-img']} />
            <img src={instagram} alt='인스타그램' className={styles['social-link-img']} />
          </div>
        )}
        {buttonComponent && buttonComponent}
      </div>
    </div>
  )
}

export default LawyerHorizon
