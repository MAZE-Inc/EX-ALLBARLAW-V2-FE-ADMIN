import { Outlet, useSearchParams } from 'react-router-dom'
import styles from './adLawfirmLayout.module.scss'
import SearchHeader, { SearchHeaderMenuItemType } from '@/components/searchHeader/SearchHeader'
import { useState, useEffect } from 'react'
import { useLawfirmInfiniteScroll } from '@/hooks/queries/useLawfirm'

export const adLawfirmMenuItems = [
  { label: '로펌이름', key: 'name' },
  { label: '인사말제목', key: 'greeting' },
]

const AdLawfirmLayout = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedItem, setSelectedItem] = useState<SearchHeaderMenuItemType | null>(() => {
    const searchType = searchParams.get('searchType')
    if (searchType === 'greeting') {
      return { label: '인사말제목', key: 'greeting' }
    }
    return { label: '로펌이름', key: 'name' }
  })

  const searchQuery = searchParams.get('search') || ''
  const searchType = (searchParams.get('searchType') as 'name' | 'greeting') || 'name'

  const { lawfirmTotal } = useLawfirmInfiniteScroll({
    searchQuery: searchQuery || undefined,
    lawfirmSearchType: searchType,
  })

  // URL 파라미터가 변경될 때 selectedItem 업데이트
  useEffect(() => {
    const type = searchParams.get('searchType')
    if (type === 'greeting') {
      setSelectedItem({ label: '인사말제목', key: 'greeting' })
    } else {
      setSelectedItem({ label: '로펌이름', key: 'name' })
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
        searchType: (selectedItem?.key as string) || 'name',
      })
    } else {
      setSearchParams({
        searchType: (selectedItem?.key as string) || 'name',
      })
    }
  }

  return (
    <div className={styles['admin-layout']}>
      <SearchHeader
        menuItems={adLawfirmMenuItems}
        className={styles['admin-layout__searchHeader']}
        bordered={false}
        title={`전체 : ${lawfirmTotal}개가 등록되어 있습니다.`}
        selectedItem={selectedItem}
        onSelectionChange={handleSelectionChange}
        onSearch={onSearch}
        defaultValue={searchQuery}
      />
      <Outlet />
    </div>
  )
}

export default AdLawfirmLayout
