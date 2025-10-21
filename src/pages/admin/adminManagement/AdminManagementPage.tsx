import { Button, ConfigProvider, Tabs, TabsProps } from 'antd'
import styles from './adminManagementPage.module.scss'
import ManagerList from '../managerList/ManagerList'
import { COLOR } from '@/styles/abstracts/color'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ROUTE_PATH } from '@/routes/routePath'
import { useState, useEffect } from 'react'
import { Admin } from '@/types/adminTypes'
import { useGetAdminList } from '@/hooks/queries/useGetAdminList'

const AdminManagementPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [currentPage, setCurrentPage] = useState(1)
  const [orderBy, setOrderBy] = useState<keyof Admin>('adminCreatedAt')
  const [sort, setSort] = useState<'asc' | 'desc'>('desc')
  const [adminIsActive, _setAdminIsActive] = useState<boolean | undefined>(undefined)
  const [activeTab, setActiveTab] = useState<'total' | 'admin-manager' | 'cs-manager'>('total')

  // URL 파라미터에서 검색어와 검색 타입 추출
  const searchQuery = searchParams.get('search') || undefined
  const searchType = (searchParams.get('searchType') as 'account' | 'email' | 'name' | 'all') || undefined

  // Admin 필드명을 API sortBy 타입으로 매핑
  const getSortBy = (
    field: keyof Admin
  ): 'accountType' | 'account' | 'email' | 'name' | 'isActive' | 'createdAt' | undefined => {
    const mapping: Record<string, 'accountType' | 'account' | 'email' | 'name' | 'isActive' | 'createdAt'> = {
      adminAccountTypeId: 'accountType',
      adminAccount: 'account',
      adminEmail: 'email',
      adminName: 'name',
      adminIsActive: 'isActive',
      adminCreatedAt: 'createdAt',
    }
    return mapping[field]
  }

  const { data: adminList, isLoading } = useGetAdminList({
    skip: currentPage - 1,
    take: 10,
    adminIsActive: adminIsActive,
    adminAccountTypeId: activeTab === 'total' ? undefined : activeTab === 'admin-manager' ? 1 : 2,
    searchQuery: searchQuery,
    searchType: searchType,
    sortBy: getSortBy(orderBy),
    sortOrder: sort,
  })

  // 검색 파라미터가 변경되면 페이지를 1로 리셋
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, searchType])

  const handleSort = (field: keyof Admin) => {
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

  const handleTabChange = (key: string) => {
    setActiveTab(key as 'total' | 'admin-manager' | 'cs-manager')
    setCurrentPage(1) // 탭이 변경되면 첫 페이지로 이동
  }

  const handleRegister = () => {
    navigate(ROUTE_PATH.ADMIN_REGISTER)
  }

  const items: TabsProps['items'] = [
    {
      key: 'total',
      label: '전체',
      children: (
        <ManagerList
          type='total'
          data={adminList || []}
          loading={isLoading}
          onSort={handleSort}
          currentOrderBy={orderBy}
          currentSort={sort}
        />
      ),
    },
    {
      key: 'admin-manager',
      label: '통합 관리자',
      children: (
        <ManagerList
          type='admin-manager'
          data={adminList || []}
          loading={isLoading}
          onSort={handleSort}
          currentOrderBy={orderBy}
          currentSort={sort}
        />
      ),
    },
    {
      key: 'cs-manager',
      label: 'CS 관리자',
      children: (
        <ManagerList
          type='cs-manager'
          data={adminList || []}
          loading={isLoading}
          onSort={handleSort}
          currentOrderBy={orderBy}
          currentSort={sort}
        />
      ),
    },
  ]

  return (
    <div className={styles['admin-management-page']}>
      <Button className={styles['manager-list-container__button']} onClick={handleRegister}>
        신규 계정 등록
      </Button>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: COLOR.GREEN_01,
          },
        }}
      >
        <Tabs defaultActiveKey='total' items={items} onChange={handleTabChange} />
      </ConfigProvider>
    </div>
  )
}

export default AdminManagementPage
