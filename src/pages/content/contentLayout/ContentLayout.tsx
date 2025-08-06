import { Outlet } from 'react-router-dom'
import styles from './contentLayout.module.scss'
import SearchHeader from '@/components/searchHeader/SearchHeader'

const ContentLayout = () => {
  const handleSearch = (value: string) => {
    console.log(value)
  }

  return (
    <div className={styles['content-layout']}>
      <SearchHeader
        title='전체 : 512개가 등록되어 있습니다.'
        placeholder='선택'
        searchPlaceholder='검색어를 입력하세요'
        onSearch={handleSearch}
        bordered={false}
      />
      <Outlet />
    </div>
  )
}

export default ContentLayout
