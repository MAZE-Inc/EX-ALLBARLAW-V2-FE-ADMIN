import SearchHeader from '@/components/searchHeader/SearchHeader'
import styles from './adLawyerList.module.scss'
import { Button, Table, TableProps } from 'antd'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ROUTE_PATH } from '@/routes/routePath'
import { useAdLawyerList } from '@/hooks/queries/useLawyer'
import { AdLawyer } from '@/types/lawyerTypes'
import LawyerHorizon from '@/components/lawyer/LawyerHorizon'
import dayjs from 'dayjs'
import { useState, useEffect } from 'react'

const AdLawyerListPage = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('search') || '')

  // URL 쿼리 파라미터가 변경될 때 searchQuery 업데이트
  useEffect(() => {
    const search = searchParams.get('search') || ''
    setSearchQuery(search)
  }, [searchParams])

  const { data: adLawyerList } = useAdLawyerList(searchQuery)

  const lawyerAmount = adLawyerList?.length

  const handleCreateLawyer = () => {
    navigate(ROUTE_PATH.AD_LAWYER_CREATE)
  }

  const handleEditAd = (record: AdLawyer) => {
    navigate(`${ROUTE_PATH.AD_LAWYER}/edit/${record.lawyerAdId}`)
  }

  // 검색어 변경 시 URL 쿼리 파라미터 업데이트
  const handleSearch = (value: string) => {
    // URL 파라미터만 업데이트하면 useEffect에서 searchQuery를 자동으로 업데이트
    if (value.trim()) {
      setSearchParams({ search: value })
    } else {
      setSearchParams({})
    }
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
        <SearchHeader
          bordered={false}
          menuItems={[{ label: '변호사 이름', key: 'lawyerName' }]}
          selectedItem={{ label: '변호사 이름', key: 'lawyerName' }}
          title={`전체 : ${lawyerAmount}개가 등록되어 있습니다.`}
          onSearch={handleSearch}
          defaultValue={searchQuery}
        />
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
