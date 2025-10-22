import React, { useState, MouseEvent } from 'react'
import Tag from '@/components/tag/Tag'
import { AlertModal } from '@/components/modal/Modal'
import { formatPhoneNumber } from '@/utils/formatUtils'
import styles from './lawfirm-horizon.module.scss'

interface LawfirmHorizonProps {
  lawfirmId?: number
  lawfirmThumbnail: string
  lawfirmName: string
  title: string
  description: string
  address: string | null
  phoneNumber: string | null
  homepageUrl: string | null
  blogUrl: string | null
  linkList?: {
    lawfirmDirectId: number
    lawfirmDirectName: string
    lawfirmDirectLink: string
  }[]
  className?: string
}

const LawfirmHorizon = ({
  lawfirmThumbnail,
  lawfirmName,
  title,
  description,
  address,
  phoneNumber,
  homepageUrl,
  blogUrl,
  linkList,
  className,
}: LawfirmHorizonProps) => {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false)

  const handleBlogClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (blogUrl) {
      window.open(blogUrl, '_blank')
    }
  }

  const handleHomepageClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (homepageUrl) {
      window.open(homepageUrl, '_blank')
    }
  }

  const handleAddressClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setIsAddressModalOpen(true)
  }

  const handlePhoneClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setIsPhoneModalOpen(true)
  }

  const handleCloseAddressModal = () => {
    setIsAddressModalOpen(false)
  }

  const handleClosePhoneModal = () => {
    setIsPhoneModalOpen(false)
  }

  return (
    <article className={`${styles['lawfirm-horizon']} ${className}`}>
      <figure>
        <img src={lawfirmThumbnail} alt={lawfirmName} className={styles.thumbnail} />
      </figure>
      <div className={styles['lawfirm-info']}>
        <header className={styles['header-wrapper']}>
          <div className={styles['info-header']}>
            <h3 className={styles['lawfirm-name']}>{lawfirmName}</h3>
            <div className={styles['contact-info']}>
              {blogUrl && (
                <button className={styles['contact-info-item']} onClick={handleBlogClick}>
                  {/* <SvgIcon name={'blog'} size={24} /> */}
                  <span>블로그</span>
                </button>
              )}
              {homepageUrl && (
                <button className={styles['contact-info-item']} onClick={handleHomepageClick}>
                  {/* <SvgIcon name={'homepage'} size={24} /> */}
                  <span>홈페이지</span>
                </button>
              )}
              {address && (
                <button className={styles['contact-info-item']} onClick={handleAddressClick}>
                  {/* <SvgIcon name={'map'} size={24} /> */}
                  <span>위치</span>
                </button>
              )}
              {phoneNumber && (
                <button className={styles['contact-info-item']} onClick={handlePhoneClick}>
                  {/* <SvgIcon name={'call'} size={24} /> */}
                  <span>연락처</span>
                </button>
              )}
            </div>
          </div>
          <img src={lawfirmThumbnail} alt={lawfirmName} className={styles.thumbnail} />
        </header>
        <section className={styles['info-description']}>
          <h3>{title}</h3>
          <p>{description}</p>
        </section>
        <div className={styles['tag-list']}>
          {linkList && linkList.map(link => <Tag key={link.lawfirmDirectId} tag={link.lawfirmDirectName} />)}
        </div>
      </div>

      {/* 위치 모달 */}
      <div onClick={e => e.stopPropagation()}>
        <AlertModal
          isOpen={isAddressModalOpen}
          onClose={handleCloseAddressModal}
          message={address || ''}
          confirmText='확인'
        />
      </div>

      {/* 연락처 모달 */}
      <div onClick={e => e.stopPropagation()}>
        <AlertModal
          isOpen={isPhoneModalOpen}
          onClose={handleClosePhoneModal}
          message={formatPhoneNumber(phoneNumber)}
          confirmText='확인'
        />
      </div>
    </article>
  )
}
export default LawfirmHorizon
