import styles from './lawyerCareer.module.scss'
import { forwardRef } from 'react'
import { LawyerDetailResponse } from '@/types/lawyerTypes'
import { Divider } from 'antd'

interface LawyerCareerProps {
  careerHistory?: LawyerDetailResponse['careers'] | []
  activities?: LawyerDetailResponse['activities'] | []
}

const LawyerCareer = forwardRef<HTMLElement, LawyerCareerProps>(({ careerHistory = [], activities = [] }, ref) => {
  const renderSection = (
    items: LawyerDetailResponse['careers'] | LawyerDetailResponse['activities'],
    emptyMessage: string
  ) => {
    if (!items || items.length === 0) {
      return (
        <div className={styles['lawyer-career__empty']}>
          <p className={styles['lawyer-career__empty-text']}>{emptyMessage}</p>
        </div>
      )
    }

    return items.map((item, index) => {
      const categoryName =
        'lawyerCareerCategoryName' in item ? item.lawyerCareerCategoryName : item.lawyerActivityCategoryName
      const content = 'lawyerCareerContent' in item ? item.lawyerCareerContent : item.lawyerActivityContent

      return (
        <div className={styles['lawyer-career__item']} key={index}>
          <h4 className={styles['lawyer-career__item-title']}>{categoryName}</h4>
          <ul className={styles['lawyer-career__list']}>
            {(content || '').split('\n').map((contentLine: string, idx: number) => (
              <li key={idx}>{contentLine}</li>
            ))}
          </ul>
        </div>
      )
    })
  }

  return (
    <section ref={ref} className={styles['lawyer-career']}>
      <div className={styles['lawyer-career__group']}>
        <h3 className={styles['lawyer-career__title']}>이력 사항</h3>
        <Divider style={{ margin: '14px 0' }} />
        <div className={styles['lawyer-career__section']}>
          {renderSection(careerHistory, '등록된 이력 사항이 없습니다')}
        </div>
      </div>

      <div className={styles['lawyer-career__group']}>
        <h3 className={styles['lawyer-career__title']}>활동 사항</h3>
        <Divider style={{ margin: '14px 0' }} />
        <div className={styles['lawyer-career__section']}>
          {renderSection(activities, '등록된 활동 사항이 없습니다')}
        </div>
      </div>
    </section>
  )
})

LawyerCareer.displayName = 'LawyerCareer'

export default LawyerCareer
