import { Outlet, useSearchParams, useLocation, useNavigate } from 'react-router-dom'
import styles from './memberLayout.module.scss'
import SearchHeader, { SearchHeaderMenuItemType } from '@/components/searchHeader/SearchHeader'
import { useState, useEffect } from 'react'
import { ROUTE_PATH } from '@/routes/routePath'

export const memberMenuItems = [
  { label: '아이디', key: 'account' },
  { label: '인증전화번호', key: 'phone' },
  { label: '이메일주소', key: 'email' },
]

const MemberLayout = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [selectedItem, setSelectedItem] = useState<SearchHeaderMenuItemType | null>(() => {
    const searchType = searchParams.get('searchType')
    if (searchType === 'phone') {
      return memberMenuItems[1] // 인증전화번호
    } else if (searchType === 'email') {
      return memberMenuItems[2] // 이메일주소
    }
    return memberMenuItems[0] // 첫 번째 아이템: 아이디
  })

  const searchQuery = searchParams.get('search') || ''

  // URL 파라미터가 변경될 때 selectedItem 업데이트
  useEffect(() => {
    const type = searchParams.get('searchType')
    if (type === 'phone') {
      setSelectedItem(memberMenuItems[1]) // 인증전화번호
    } else if (type === 'email') {
      setSelectedItem(memberMenuItems[2]) // 이메일주소
    } else {
      setSelectedItem(memberMenuItems[0]) // 아이디
    }
  }, [searchParams])

  const handleSelectionChange = (item: SearchHeaderMenuItemType) => {
    setSelectedItem(item)
    // 선택만 변경하고 API 호출은 하지 않음 (검색 시에만 호출)
  }

  const onSearch = (value: string) => {
    const searchType = (selectedItem?.key as string) || 'account'

    // 리스트 페이지인지 확인 (정확히 /member-member인 경우)
    const isListPage = location.pathname === ROUTE_PATH.MEMBER

    if (!isListPage) {
      // 상세 페이지에서 검색하면 리스트 페이지로 이동
      if (value.trim()) {
        navigate(`${ROUTE_PATH.MEMBER}?search=${value}&searchType=${searchType}`)
      } else {
        navigate(`${ROUTE_PATH.MEMBER}?searchType=${searchType}`)
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
        menuItems={memberMenuItems}
        className={styles['admin-layout__searchHeader']}
        bordered={false}
        title='회원 관리'
        selectedItem={selectedItem}
        onSelectionChange={handleSelectionChange}
        onSearch={onSearch}
        defaultValue={searchQuery}
      />
      <Outlet />
    </div>
  )
}

export default MemberLayout
