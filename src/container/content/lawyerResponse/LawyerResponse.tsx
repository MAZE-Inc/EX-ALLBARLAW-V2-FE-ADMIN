import { Card, Divider } from 'antd'
import styles from './lawyer-response.module.scss'

type LawyerResponseProps = {
  lawyers: {
    lawyerId: number
    lawyerName: string
    lawfirmName: string
    lawyerDescription: string
    lawyerProfileImage: string
    content: string
  }[]
}

const LawyerResponse = ({ lawyers }: LawyerResponseProps) => {
  return (
    <section className={styles['lawyer-response']}>
      {lawyers.map(lawyer => (
        <Card key={lawyer.lawyerId} className={styles['lawyer-response-card']}>
          <header className={styles['card-header']}>
            <figure>
              <img src={lawyer.lawyerProfileImage} alt={lawyer.lawyerName} />
            </figure>
            <div className={styles['card-header-info']}>
              <div className={styles['info-header']}>
                <h4 className={styles['lawyer-name']}>{lawyer.lawyerName}</h4>
                <p className={styles['lawfirm-name']}>{lawyer.lawfirmName}</p>
                <div className={styles['selected-badge']}>
                  <span>의뢰인 선택</span>
                  {/* <SvgIcon name='checkRound' stroke={COLOR.icon_darkgreen} fill={COLOR.white} size={10} /> */}
                </div>
              </div>
              <p className={styles['info-description']}>{lawyer.lawyerDescription}</p>
              <button className={styles['barotalk-btn']}>바로톡</button>
            </div>
          </header>
          <Divider />
          <p className={styles['description']}>{lawyer.content}</p>

          <footer className={styles.footer}>
            <span className={styles['answer-date']}>
              <strong>3시간전</strong>
              <span>답변</span>
            </span>
          </footer>
        </Card>
      ))}
    </section>
  )
}

export default LawyerResponse
