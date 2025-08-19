import Divider from '@/components/divider/Divider'
import styles from './lawyerAchievements.module.scss'
import { LawyerAchievement } from '@/types/lawyerTypes'

type LawyerAchievementsProps = {
  achievements: LawyerAchievement[]
}

const LawyerAchievements = ({ achievements }: LawyerAchievementsProps) => {
  const displayAchievements = achievements.length > 0 ? achievements : mockAchievements

  if (achievements.length === 0) {
    return (
      <section className={styles['lawyer-achievements']} aria-label='변호사 업적'>
        <h3 className={styles['lawyer-achievements__title']}>업적</h3>
        <Divider padding={14} />
        <div className={styles['lawyer-achievements__empty']}>
          <p className={styles['lawyer-achievements__empty-text']}>아직 획득한 업적이 없습니다</p>
          <p className={styles['lawyer-achievements__empty-description']}>
            변호사님의 활동과 의뢰인 평가를 통해 업적을 획득할 수 있습니다
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className={styles['lawyer-achievements']} aria-label='변호사 업적'>
      <h3 className={styles['lawyer-achievements__title']}>업적</h3>
      <Divider padding={14} />
      <ul className={styles['lawyer-achievements__list']}>
        {displayAchievements.map(achievement => (
          <li className={styles['lawyer-achievements__item']} key={achievement.id}>
            <figure>
              <img
                src={'emblem' in achievement ? achievement.emblem : 'https://picsum.photos/200/300'}
                alt={'name' in achievement ? achievement.name : achievement.title}
              />
            </figure>
            <div className={styles['lawyer-achievements__item-content']}>
              <h4 className={styles['lawyer-achievements__item-title']}>
                {'name' in achievement ? achievement.name : achievement.title}
              </h4>
              <p className={styles['lawyer-achievements__item-description']}>{achievement.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default LawyerAchievements

const mockAchievements = [
  {
    id: 1,
    emblem: 'https://picsum.photos/200/300',
    title: '출석왕',
    description: '10명이상의 의뢰인이 평가했어요',
  },
  {
    id: 2,
    emblem: 'https://picsum.photos/200/300',
    title: '꾸준왕',
    description: '10명이상의 의뢰인이 평가했어요',
  },
  {
    id: 3,
    emblem: 'https://picsum.photos/200/300',
    title: '열정변호사',
    description: '10명이상의 의뢰인이 평가했어요',
  },
  {
    id: 4,
    emblem: 'https://picsum.photos/200/300',
    title: '답변왕',
    description: '10명이상의 의뢰인이 평가했어요',
  },
  {
    id: 5,
    emblem: 'https://picsum.photos/200/300',
    title: '알찬답변가',
    description: '10명이상의 의뢰인이 평가했어요',
  },
  {
    id: 6,
    emblem: 'https://picsum.photos/200/300',
    title: '지식인마스터',
    description: '10명이상의 의뢰인이 평가했어요',
  },
]
