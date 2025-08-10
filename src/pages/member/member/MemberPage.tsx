import { Button, ConfigProvider, Tabs, TabsProps } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { COLOR } from '@/styles/abstracts/color'
import MemberList from '../../../container/member/memberList/MemberList'
import styles from './memberPage.module.scss'
import { Pagination } from '@/components/pagination'
import { useGetTotalMemberPage } from '@/hooks/queries/useGetTotalMemberPage'
import { useState } from 'react'
import { useGetMemberList } from '@/hooks/queries/useGetMemberList'
import { Member, MemberListRequest } from '@/types/memberType'
import { useExcelExport } from '@/hooks/useExcelExport'

const MemberPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState<'total' | 'active' | 'inactive'>('total')
  const [orderBy, setOrderBy] = useState<MemberListRequest['orderBy']>('createdAt')
  const [sort, setSort] = useState<MemberListRequest['sort']>('desc')
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([])
  
  const { exportData } = useExcelExport()

  const { data: totalPages } = useGetTotalMemberPage()
  const { data: memberList, isLoading } = useGetMemberList({
    userPage: currentPage,
    orderBy,
    userIsActive: activeTab === 'total' ? 'all' : activeTab,
    sort,
  })

  const handleTabChange = (key: string) => {
    setActiveTab(key as 'total' | 'active' | 'inactive')
    setCurrentPage(1) // 탭 변경 시 페이지 초기화
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }
  
  const handleSelectionChange = (selectedRows: Member[]) => {
    setSelectedMembers(selectedRows)
  }
  
  const handleExcelDownload = () => {
    if (selectedMembers.length === 0) {
      return
    }
    
    // 엑셀에 표시할 데이터 형식으로 변환
    const excelData = selectedMembers.map(member => ({
      '아이디': member.userAccount,
      '인증 전화번호': member.userPhone,
      '이메일 주소': member.userEmail,
      '가입일시': member.userCreatedAt,
      '계정 상태': member.userIsActive ? '사용중' : '정지',
      '정지 사유': member.userBanReason || '-',
    }))
    
    exportData(excelData, '회원목록', '회원정보')
  }

  const handleSort = (field: MemberListRequest['orderBy']) => {
    if (field === orderBy) {
      // 같은 필드를 클릭한 경우 정렬 방향을 토글
      setSort(sort === 'asc' ? 'desc' : 'asc')
    } else {
      // 다른 필드를 클릭한 경우 해당 필드로 변경하고 내림차순으로 시작
      setOrderBy(field)
      setSort('desc')
    }
    setCurrentPage(1) // 정렬이 변경되면 첫 페이지로 이동
  }

  const items: TabsProps['items'] = [
    {
      key: 'total',
      label: '전체',
    },
    {
      key: 'active',
      label: '사용중인 계정',
    },
    {
      key: 'inactive',
      label: '정지된 계정',
    },
  ]

  return (
    <div className={styles['member-page']}>
      <div className={styles['member-page__button-wrapper']}>
        <Button 
          icon={<DownloadOutlined />}
          onClick={handleExcelDownload}
          disabled={selectedMembers.length === 0}
        >
          선택 항목 엑셀 다운로드 ({selectedMembers.length}건)
        </Button>
      </div>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: COLOR.GREEN_01,
          },
        }}
      >
        <Tabs defaultActiveKey='total' items={items} onChange={handleTabChange} />
      </ConfigProvider>
      <MemberList
        data={memberList || []}
        loading={isLoading}
        onSort={handleSort}
        currentOrderBy={orderBy}
        currentSort={sort}
        onSelectionChange={handleSelectionChange}
      />
      {totalPages?.totalPages && (
        <div className={styles['pagination-wrapper']}>
          <Pagination currentPage={currentPage} totalPages={totalPages.totalPages} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  )
}

export default MemberPage
