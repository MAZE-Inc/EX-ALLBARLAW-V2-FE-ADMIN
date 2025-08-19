import Divider from '@/components/divider/Divider'
import styles from './lawyerActivity.module.scss'
import { LawyerDetailResponse } from '@/types/lawyerTypes'
import dayjs from 'dayjs'

type LawyerActivityProps = {
  statistics: LawyerDetailResponse['statistics'] | null
  createdAt: string
}

const LawyerActivity = ({ statistics, createdAt }: LawyerActivityProps) => {
  const formatNumber = (value: number | undefined): string => {
    return value?.toLocaleString() ?? '0'
  }

  return (
    <section className={styles['lawyer-activity']}>
      <h3 className={styles['activity-title']}>올바로 활동</h3>
      <Divider padding={14} />
      <table className={styles['horizontal-table']}>
        <thead>
          <tr>
            <th>가입일자</th>
            <th>방문횟수/최근1달</th>
            <th>법률정보의 글</th>
            <th>변호사의 영상</th>
            <th>법률 지식인 답변</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{createdAt ? dayjs(createdAt).format('YYYY-MM-DD') : '-'}</td>
            <td>
              {formatNumber(statistics?.totalSiteVisitCount)} / {formatNumber(statistics?.last30DaysSiteVisitCount)}
            </td>
            <td>{formatNumber(statistics?.blogPostCount)}</td>
            <td>{formatNumber(statistics?.videoCount)}</td>
            <td>{formatNumber(statistics?.knowledgeAnswerCount)}</td>
          </tr>
        </tbody>
      </table>

      <table className={styles['vertical-table']}>
        <tbody>
          <tr>
            <th>올바로 변호사</th>
            <td>{createdAt ? dayjs(createdAt).format('YYYY-MM-DD') : '-'}</td>
          </tr>
          <tr>
            <th>방문횟수 전체/최근1달</th>
            <td>
              {formatNumber(statistics?.totalSiteVisitCount)} / {formatNumber(statistics?.last30DaysSiteVisitCount)}
            </td>
          </tr>
          <tr>
            <th>블로그글</th>
            <td>{formatNumber(statistics?.blogPostCount)}</td>
          </tr>
          <tr>
            <th>법률 영상</th>
            <td>{formatNumber(statistics?.videoCount)}</td>
          </tr>
          <tr>
            <th>법률 지식인 답변</th>
            <td>{formatNumber(statistics?.knowledgeAnswerCount)}</td>
          </tr>
        </tbody>
      </table>
    </section>
  )
}

export default LawyerActivity
