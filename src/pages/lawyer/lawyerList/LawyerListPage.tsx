import { useState } from 'react'
import { Table, TableProps, Avatar, Button } from 'antd'
import dayjs from 'dayjs'
import { useLawyerList } from '@/hooks/queries/useLawyer'
import { LawyerListRequest, Lawyer } from '@/types/lawyerTypes'
import { Pagination } from '@/components/pagination/Pagination'
import { blog, instagram, youtube } from '@/assets/imgs'
import styles from './lawyerList.module.scss'
import { DownloadOutlined } from '@ant-design/icons'
import { useExcelExport } from '@/hooks/useExcelExport'

const LawyerListPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRows, setSelectedRows] = useState<Lawyer[]>([])
  const [request, setRequest] = useState<LawyerListRequest>({
    lawyerPage: 1,
    orderBy: 'createdAt',
    sort: 'desc',
  })

  const { data: lawyerData, isLoading } = useLawyerList(request)
  const { exportData } = useExcelExport()

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setRequest(prev => ({
      ...prev,
      lawyerPage: page,
    }))
  }

  console.log(lawyerData)

  // 엑셀 다운로드 핸들러
  const handleExcelDownload = () => {
    if (selectedRows.length === 0) return

    // 엑셀에 저장할 데이터 준비
    const excelData = selectedRows.map(lawyer => ({
      변호사명: lawyer.lawyerName || '',
      소속: lawyer.lawyerLawfirmName || '',
      // 가입일자: lawyer.createdAt ? dayjs(lawyer.createdAt).format('YYYY-MM-DD') : '-',
      방문횟수: lawyer.lawyerTotalSiteVisitCount || 0,
      글: lawyer.lawyerBlogCaseCount || 0,
      영상: lawyer.lawyerVideoCaseCount || 0,
      지식인: lawyer.lawyerChatRoomCount || 0,
      블로그URL: lawyer.lawyerBlogUrl || '',
      유튜브URL: lawyer.lawyerYoutubeUrl || '',
      인스타그램URL: lawyer.lawyerInstagramUrl || '',
    }))

    // useExcelExport 훅의 exportData 함수 사용
    exportData(excelData, '변호사목록', '변호사 목록')
  }

  // // SNS 링크 핸들러
  // const handleSnsClick = (url: string | undefined, e: React.MouseEvent) => {
  //   e.stopPropagation() // 행 클릭 이벤트 방지
  //   if (url) {
  //     window.open(url, '_blank')
  //   }
  // }

  const columns: TableProps<Lawyer>['columns'] = [
    {
      title: '변호사 사진',
      dataIndex: 'lawyerProfileImage',
      key: 'lawyerProfileImage',
      width: 140,
      render: (image: string) => <Avatar src={image} size={120} shape='square' className={styles.lawyerImage} />,
    },
    {
      title: '변호사명',
      dataIndex: 'lawyerName',
      key: 'lawyerName',
    },
    {
      title: '소속',
      dataIndex: 'lawyerLawfirmName',
      key: 'lawyerLawfirmName',
    },
    {
      title: '가입일자',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (date ? dayjs(date).format('YYYY-MM-DD') : '-'),
    },
    {
      title: '방문횟수',
      dataIndex: 'lawyerTotalSiteVisitCount',
      key: 'lawyerTotalSiteVisitCount',
      render: (count: number) => count?.toLocaleString() || '0',
    },
    {
      title: '글',
      dataIndex: 'lawyerBlogCaseCount',
      key: 'lawyerBlogCaseCount',
      render: (count: number) => count?.toLocaleString() || '0',
    },
    {
      title: '영상',
      dataIndex: 'lawyerVideoCaseCount',
      key: 'lawyerVideoCaseCount',
      render: (count: number) => count?.toLocaleString() || '0',
    },
    {
      title: '지식인',
      dataIndex: 'lawyerChatRoomCount',
      key: 'lawyerChatRoomCount',
      render: (count: number) => count?.toLocaleString() || '0',
    },
    {
      title: 'SNS',
      key: 'sns',
      width: 150,
      render: (_, record) => (
        <div className={styles.snsIcons}>
          <img
            src={blog}
            alt='Blog'
            className={`${styles.snsIcon} ${!record.lawyerBlogUrl ? styles.disabled : ''}`}
            // onClick={e => handleSnsClick(record.lawyerBlogUrl, e)}
          />
          <img
            src={youtube}
            alt='YouTube'
            className={`${styles.snsIcon} ${!record.lawyerYoutubeUrl ? styles.disabled : ''}`}
            // onClick={e => handleSnsClick(record.lawyerYoutubeUrl, e)}
          />
          <img
            src={instagram}
            alt='Instagram'
            className={`${styles.snsIcon} ${!record.lawyerInstagramUrl ? styles.disabled : ''}`}
            // onClick={e => handleSnsClick(record.lawyerInstagramUrl, e)}
          />
        </div>
      ),
    },
  ]

  const rowSelection = {
    selectedRowKeys: selectedRows.map(row => row.lawyerId),
    onSelectAll: (selected: boolean, selectedRows: Lawyer[]) => {
      const newSelectedRows = selected ? selectedRows : []
      setSelectedRows(newSelectedRows)
    },
    onSelect: (record: Lawyer, selected: boolean) => {
      setSelectedRows(prev => {
        const newSelectedRows = selected ? [...prev, record] : prev.filter(row => row.lawyerId !== record.lawyerId)
        return newSelectedRows
      })
    },
  }

  return (
    <div className={styles['lawyer-list-container']}>
      <div className={styles['button-wrapper']}>
        <Button icon={<DownloadOutlined />} onClick={handleExcelDownload} disabled={selectedRows.length === 0}>
          선택 항목 엑셀 다운로드 ({selectedRows.length}건)
        </Button>
      </div>
      <Table<Lawyer>
        columns={columns}
        dataSource={lawyerData?.lawyerList || []}
        rowSelection={rowSelection}
        rowKey='lawyerId'
        pagination={false}
        loading={isLoading}
      />
      {lawyerData?.totalPages && (
        <div className={styles['pagination-wrapper']}>
          <Pagination currentPage={currentPage} totalPages={lawyerData.totalPages} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  )
}

export default LawyerListPage
