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

    return items.map((item: any, index) => {
      // 서버에서 오는 실제 키값 사용 (categoryName, content)
      const categoryName = item.categoryName ||
        ('lawyerCareerCategoryName' in item ? item.lawyerCareerCategoryName :
         'lawyerActivityCategoryName' in item ? item.lawyerActivityCategoryName : '')

      const content = item.content ||
        ('lawyerCareerContent' in item ? item.lawyerCareerContent :
         'lawyerActivityContent' in item ? item.lawyerActivityContent : '')

      return (
        <div className={styles['lawyer-career__item']} key={item.id || index}>
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
