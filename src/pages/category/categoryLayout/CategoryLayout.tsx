import SearchHeader from '@/components/searchHeader/SearchHeader'
import { Outlet } from 'react-router-dom'

const CategoryLayout = () => {
  //   const [selectedItem, setSelectedItem] = useState<SearchHeaderMenuItemType | null>(null)
  //   const [_searchValue, setSearchValue] = useState('')
  return (
    <>
      <SearchHeader placeholder='분류 선택' searchPlaceholder='검색어를 입력하세요' bordered={false} title={`전체 .`} />
      <Outlet />
    </>
  )
}

export default CategoryLayout
