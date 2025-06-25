import { DownOutlined } from '@ant-design/icons'
import { Button, Dropdown, Input, MenuProps, message, Space } from 'antd'
import { CSSProperties } from 'react'
import styles from './search-header.module.scss'

export type SearchHeaderMenuItemType = NonNullable<MenuProps['items']>[number]

interface SearchHeaderProps {
  selectedItem: SearchHeaderMenuItemType | null
  onSelectionChange: (item: SearchHeaderMenuItemType) => void
  placeholder?: string
  menuItems: MenuProps['items']
  className?: string
  style?: CSSProperties
}

const SearchHeader = ({
  selectedItem,
  onSelectionChange,
  placeholder = 'Button',
  menuItems,
  className,
  style,
}: SearchHeaderProps) => {
  const items = menuItems || []

  const getDisplayText = () => {
    if (!selectedItem) return placeholder

    if ('label' in selectedItem) {
      return selectedItem.label as string
    }
    return placeholder
  }

  const selectedItemText = getDisplayText()

  const handleMenuClick: MenuProps['onClick'] = e => {
    // 선택된 아이템 찾기
    const clickedItem = items?.find(item => item?.key === e.key)
    if (clickedItem) {
      onSelectionChange(clickedItem)

      const label = 'label' in clickedItem ? clickedItem.label : e.key
      message.info(`선택됨: ${label}`)
    }
  }

  const menuProps = {
    items,
    onClick: handleMenuClick,
  }

  return (
    <header className={`${styles.searchHeader} ${className || ''}`} style={style}>
      <div className={styles.searchHeader__container}>
        <Dropdown menu={menuProps} trigger={['click']}>
          <Button className={styles.searchHeader__container__button}>
            <Space>
              {selectedItemText}
              <DownOutlined style={{ minWidth: '16px' }} />
            </Space>
          </Button>
        </Dropdown>
        <Input.Search placeholder='Filled' variant='filled' />
      </div>
      <Button>공지 등록하기</Button>
    </header>
  )
}

export default SearchHeader
