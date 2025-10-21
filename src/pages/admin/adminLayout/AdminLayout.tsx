import { Outlet, useSearchParams, useLocation, useNavigate } from 'react-router-dom'
import styles from './adminLayout.module.scss'
import SearchHeader, { SearchHeaderMenuItemType } from '@/components/searchHeader/SearchHeader'
import { useState, useEffect } from 'react'
import { ROUTE_PATH } from '@/routes/routePath'

export const adminMenuItems = [
  { label: '아이디', key: 'account' },
  { label: '이메일주소', key: 'email' },
  { label: '계정이름', key: 'name' },
]

const AdminLayout = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [selectedItem, setSelectedItem] = useState<SearchHeaderMenuItemType | null>(() => {
    const searchType = searchParams.get('searchType')
    if (searchType === 'email') {
      return adminMenuItems[1] // 이메일주소
    } else if (searchType === 'name') {
      return adminMenuItems[2] // 계정이름
    }
    return adminMenuItems[0] // 첫 번째 아이템: 아이디
  })

  const searchQuery = searchParams.get('search') || ''

  // URL 파라미터가 변경될 때 selectedItem 업데이트
  useEffect(() => {
    const type = searchParams.get('searchType')
    if (type === 'email') {
      setSelectedItem(adminMenuItems[1]) // 이메일주소
    } else if (type === 'name') {
      setSelectedItem(adminMenuItems[2]) // 계정이름
    } else {
      setSelectedItem(adminMenuItems[0]) // 아이디
    }
  }, [searchParams])

  const handleSelectionChange = (item: SearchHeaderMenuItemType) => {
    setSelectedItem(item)
    // 선택만 변경하고 API 호출은 하지 않음 (검색 시에만 호출)
  }

  const onSearch = (value: string) => {
    const searchType = (selectedItem?.key as string) || 'account'

    // 등록/수정 페이지에 있다면 리스트 페이지로 이동
    if (location.pathname.includes('register')) {
      if (value.trim()) {
        navigate(`${ROUTE_PATH.ADMIN_MANAGEMENT}?search=${value}&searchType=${searchType}`)
      } else {
        navigate(`${ROUTE_PATH.ADMIN_MANAGEMENT}?searchType=${searchType}`)
      }
    } else {
      // 리스트 페이지에 있다면 현재 페이지에서 검색
      if (value.trim()) {
        setSearchParams({
          search: value,
          searchType: searchType,
        })
      } else {
        setSearchParams({
          searchType: searchType,
        })
      }
    }
  }

  return (
    <div className={styles['admin-layout']}>
      <SearchHeader
        menuItems={adminMenuItems}
        className={styles['admin-layout__searchHeader']}
        bordered={false}
        title='관리자 계정 관리'
        selectedItem={selectedItem}
        onSelectionChange={handleSelectionChange}
        onSearch={onSearch}
        defaultValue={searchQuery}
      />
      <Outlet />
    </div>
  )
}

export default AdminLayout
