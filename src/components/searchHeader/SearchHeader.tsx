import { DownOutlined } from '@ant-design/icons'
import { Button, Dropdown, Input, MenuProps, message, Space } from 'antd'
import React, { CSSProperties, useState } from 'react'
import styles from './search-header.module.scss'

export type SearchHeaderMenuItemType = NonNullable<MenuProps['items']>[number]

interface SearchHeaderProps {
  selectedItem: SearchHeaderMenuItemType | null
  onSelectionChange: (item: SearchHeaderMenuItemType) => void
  placeholder?: string
  searchPlaceholder?: string
  menuItems: MenuProps['items']
  className?: string
  style?: CSSProperties
  buttonText?: string
  onButtonClick?: () => void
  onSearch?: (value: string) => void
}

const SearchHeader = ({
  selectedItem,
  onSelectionChange,
  placeholder = 'Button',
  searchPlaceholder = 'Search',
  menuItems,
  className,
  style,
  buttonText,
  onButtonClick,
  onSearch,
}: SearchHeaderProps) => {
  const [searchValue, setSearchValue] = useState('')
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)

  const handleSearch = (value: string) => onSearch?.(value)

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
        <Input.Search
          placeholder={searchPlaceholder}
          variant='filled'
          onChange={handleInputChange}
          value={searchValue}
          onSearch={handleSearch}
          onPressEnter={() => handleSearch(searchValue)}
        />
      </div>
      {buttonText && <Button onClick={onButtonClick}>{buttonText}</Button>}
    </header>
  )
}

export default SearchHeader
