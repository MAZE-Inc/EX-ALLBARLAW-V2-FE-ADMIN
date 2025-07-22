import { Member, MemberInfoItem } from '@/types/memberType'
import styles from './memberInfo.module.scss'

interface InfoTableProps {
  title: string
  items: MemberInfoItem[]
  sectionNumber: number
  userInfo: Member
}

const MemberInfo = ({ title, items, userInfo }: InfoTableProps) => {
  const getValue = (item: MemberInfoItem) => {
    const value = userInfo[item.key as keyof Member]
    return item.formatter ? item.formatter(value) : String(value || '')
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>
        <span className={styles.icon}>♦</span>
        {title}
      </h2>

      <div className={styles.infoTable}>
        {items.map(item => (
          <div key={item.key} className={styles.row}>
            <div className={styles.label}>{item.label}</div>
            <div className={styles.value}>{getValue(item)}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default MemberInfo
