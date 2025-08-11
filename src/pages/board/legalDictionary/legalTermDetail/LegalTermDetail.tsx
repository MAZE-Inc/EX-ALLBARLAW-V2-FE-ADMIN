import { useParams, useNavigate } from 'react-router-dom'
import { Button, Spin } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { useLegalTermDetail } from '@/hooks/queries/useLegalTerm'
import { ROUTE_PATH } from '@/routes/routePath'
import styles from './legalTermDetail.module.scss'

interface LegalTermInfo {
  key: string
  label: string
  formatter?: (value: any) => string
}

const LegalTermDetail = () => {
  const { termId } = useParams()
  const navigate = useNavigate()

  // API 호출
  const { data: termData, isLoading } = useLegalTermDetail(Number(termId))

  const handleEdit = () => {
    // 수정 페이지로 이동 (데이터를 state로 전달)
    navigate(`${ROUTE_PATH.BOARD_LEGAL_DICTIONARY}/${ROUTE_PATH.BOARD_LEGAL_DICTIONARY_EDIT}/${termId}`, {
      state: { termDetail: termData }
    })
  }

  const basicInfo: LegalTermInfo[] = [
    { key: 'koreanName', label: '한글 용어명' },
    { key: 'englishName', label: '영문 용어명' },
    { key: 'chineseName', label: '한문 용어명' },
    { key: 'source', label: '출처' },
    { key: 'content', label: '용어 설명' },
  ]

  const getValue = (item: LegalTermInfo) => {
    if (!termData) return ''
    const value = termData[item.key as keyof typeof termData]
    return item.formatter ? item.formatter(value) : String(value || '')
  }

  if (isLoading) {
    return (
      <div className={styles['legal-term-detail']}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
          <Spin size='large' />
        </div>
      </div>
    )
  }

  if (!termData) {
    return (
      <div className={styles['legal-term-detail']}>
        <div style={{ textAlign: 'center', padding: '50px' }}>데이터를 불러올 수 없습니다.</div>
      </div>
    )
  }

  return (
    <div className={styles['legal-term-detail']}>
      <div className={styles['button-wrapper']}>
        <Button icon={<EditOutlined />} onClick={handleEdit}>
          용어 수정하기
        </Button>
      </div>

      <div className={styles['detail-container']}>
        <section className={styles.section}>
          <div className={styles.infoTable}>
            {basicInfo.map(item => (
              <div key={item.key} className={styles.row}>
                <div className={styles.label}>{item.label}</div>
                <div className={styles.value}>{getValue(item)}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default LegalTermDetail
