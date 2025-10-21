import { Outlet, useSearchParams } from 'react-router-dom'
import styles from './adminLayout.module.scss'
import SearchHeader, { SearchHeaderMenuItemType } from '@/components/searchHeader/SearchHeader'
import { useState, useEffect } from 'react'

export const adminMenuItems = [
  { label: '아이디', key: 'account' },
  { label: '이메일주소', key: 'email' },
  { label: '계정이름', key: 'name' },
]

const AdminLayout = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedItem, setSelectedItem] = useState<SearchHeaderMenuItemType | null>(() => {
    const searchType = searchParams.get('searchType')
    if (searchType === 'email') {
      return { label: '이메일주소', key: 'email' }
    } else if (searchType === 'name') {
      return { label: '계정이름', key: 'name' }
    }
    return { label: '아이디', key: 'account' }
  })

  const searchQuery = searchParams.get('search') || ''

  // URL 파라미터가 변경될 때 selectedItem 업데이트
  useEffect(() => {
    const type = searchParams.get('searchType')
    if (type === 'email') {
      setSelectedItem({ label: '이메일주소', key: 'email' })
    } else if (type === 'name') {
      setSelectedItem({ label: '계정이름', key: 'name' })
    } else {
      setSelectedItem({ label: '아이디', key: 'account' })
    }
  }, [searchParams])

  const handleSelectionChange = (item: SearchHeaderMenuItemType) => {
    setSelectedItem(item)
    if (!item) return
    const newSearchType = item.key as string
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev)
      newParams.set('searchType', newSearchType)
      return newParams
    })
  }

  const onSearch = (value: string) => {
    if (value.trim()) {
      setSearchParams({
        search: value,
        searchType: (selectedItem?.key as string) || 'account',
      })
    } else {
      setSearchParams({
        searchType: (selectedItem?.key as string) || 'account',
      })
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
