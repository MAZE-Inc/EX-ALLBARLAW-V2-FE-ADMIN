import SearchHeader from '@/components/searchHeader/SearchHeader'
import styles from './adLawyerList.module.scss'
import { adminMenuItems } from '@/constants/admin'
import { Button, Table, TableProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import { ROUTE_PATH } from '@/routes/routePath'
import { useAdLawyerList } from '@/hooks/queries/useLawyer'
import { AdLawyer } from '@/types/lawyerTypes'
import LawyerHorizon from '@/components/lawyer/LawyerHorizon'
import dayjs from 'dayjs'

const AdLawyerListPage = () => {
  const navigate = useNavigate()

  const { data: adLawyerList } = useAdLawyerList()

  console.log(adLawyerList)

  const handleCreateLawyer = () => {
    navigate(ROUTE_PATH.AD_LAWYER_CREATE)
  }

  const handleEditAd = (_record: AdLawyer) => {
    // navigate(`${ROUTE_PATH.AD_LAWYER_/EDIT}/${record.lawyerAdId}`)
  }

  const columns: TableProps<AdLawyer>['columns'] = [
    {
      title: 'No.',
      width: 80,
      render: (_, __, index) => index + 1,
    },
    {
      title: '등록된 변호사 광고',
      dataIndex: 'lawyerAdLawyerName',
      render: (_, record) => (
        <LawyerHorizon
          name={record.lawyerAdLawyerName}
          profileImage={record.lawyerAdLawyerProfileImage || ''}
          description={record.lawyerAdLawyerDescription}
          lawfirm='법무법인 일신 강남분사무소'
          tags={record.lawyerAdLawyerTags}
          size='small'
          ad={true}
        />
      ),
    },
    {
      title: '배너기간',
      dataIndex: 'lawyerAdStartedAt',
      width: 200,
      render: (_, record) => (
        <span>
          {dayjs(record.lawyerAdStartedAt).format('YYYY-MM-DD')} ~{' '}
          {dayjs(record.lawyerAdFinishedAt).format('YYYY-MM-DD')}
        </span>
      ),
    },
    {
      title: '관리',
      width: 120,
      render: (_, record) => (
        <Button type='primary' size='small' onClick={() => handleEditAd(record)}>
          광고관리
        </Button>
      ),
    },
  ]

  return (
    <div className={styles.adLawyerListPage}>
      <header className={styles.adLawyerListPage__header}>
        <SearchHeader menuItems={adminMenuItems} bordered={false} />
        <Button type='primary' className={styles['adLawyerListPage__header-button']} onClick={handleCreateLawyer}>
          메인화면배너광고등록하기
        </Button>
      </header>
      <div className={styles.adLawyerListPage__content}>
        <Table<AdLawyer>
          columns={columns}
          dataSource={adLawyerList || []}
          rowKey='lawyerAdId'
          pagination={false}
          loading={!adLawyerList}
        />
      </div>
    </div>
  )
}

export default AdLawyerListPage
