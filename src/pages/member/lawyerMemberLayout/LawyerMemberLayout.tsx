import SearchHeader, { SearchHeaderMenuItemType } from '@/components/searchHeader/SearchHeader'
import styles from './lawyerMemberLayout.module.scss'
import { Outlet, useNavigate } from 'react-router-dom'
import { ROUTE_PATH } from '@/routes/routePath'
import { useState } from 'react'

const lawyerMenuItems = [
  {
    label: '아이디',
    key: 'account',
  },
  {
    label: '이메일주소',
    key: 'email',
  },
  {
    label: '변호사이름',
    key: 'name',
  },
  {
    label: '연락처',
    key: 'contact',
  },
  {
    label: '소속',
    key: 'lawfirmName',
  },
  {
    label: '소속연락처',
    key: 'lawfirmContact',
  },
]

const LawyerMemberLayout = () => {
  const navigation = useNavigate()
  const [selectedItem, setSelectedItem] = useState<SearchHeaderMenuItemType | null>({
    label: '아이디',
    key: 'account',
  })

  const handleSelectionChange = (item: SearchHeaderMenuItemType) => {
    setSelectedItem(item)
  }

  const handleSearch = (value: string) => {
    const params = new URLSearchParams()
    if (value) params.set('searchQuery', value)
    if (selectedItem?.key) params.set('searchType', String(selectedItem.key))
    navigation(`${ROUTE_PATH.LAWYER_MEMBER}?${params.toString()}`)
  }

  return (
    <main>
      <section>
        <header className={styles['lawyer-member-layout__header']}>
          <SearchHeader
            className={styles['lawyer-member-layout__search-header']}
            bordered={false}
            title=''
            placeholder='선택'
            menuItems={lawyerMenuItems}
            onSearch={handleSearch}
            onSelectionChange={handleSelectionChange}
            selectedItem={selectedItem}
          />
        </header>
        <article>
          <Outlet />
        </article>
      </section>
    </main>
  )
}

export default LawyerMemberLayout
