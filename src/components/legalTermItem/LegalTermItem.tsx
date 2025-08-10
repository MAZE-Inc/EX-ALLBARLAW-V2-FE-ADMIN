import styles from './legalTermItem.module.scss'

interface LegalTermItemProps {
  legalTermId: number
  koreanName: string
  chineseName: string
  englishName: string
  onClick: () => void
}

const LegalTermItem = ({ legalTermId, koreanName, chineseName, englishName, onClick }: LegalTermItemProps) => {
  return (
    <div key={legalTermId} className={styles.legalDictionaryItem} onClick={onClick}>
      <p className={styles.koreanName}>{koreanName}</p>
      <p className={styles.otherName}>
        [{chineseName}/{englishName}]
      </p>
    </div>
  )
}

export default LegalTermItem
