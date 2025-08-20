import SearchHeader, { SearchHeaderMenuItemType } from '@/components/searchHeader/SearchHeader'
import { adminMenuItems } from '@/constants/admin'
import { Button } from 'antd'
import { useState } from 'react'

const AdLawfirmEditPage = () => {
  const [selectedItem, setSelectedItem] = useState<SearchHeaderMenuItemType | null>(null)

  const handleSelectionChange = (item: SearchHeaderMenuItemType) => {
    setSelectedItem(item)
  }

  return (
    <div>
      <SearchHeader
        menuItems={adminMenuItems}
        bordered={false}
        title={`로펌 광고 등록 화면입니다. `}
        selectedItem={selectedItem}
        onSelectionChange={handleSelectionChange}
      />
      <section>
        <header>
          <Button>로펌 광고 등록하기</Button>
        </header>
      </section>
    </div>
  )
}

export default AdLawfirmEditPage
