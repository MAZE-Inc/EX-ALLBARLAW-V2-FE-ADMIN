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
  menuItems?: MenuProps['items']
  className?: string
  style?: CSSProperties
  buttonComponent?: React.ReactNode
  onSearch?: (value: string) => void
  title?: string
  bordered?: boolean
}

const SearchHeader = ({
  selectedItem,
  onSelectionChange,
  placeholder = 'Button',
  searchPlaceholder = 'Search',
  menuItems,
  className,
  style,
  title,
  buttonComponent,
  onSearch,
  bordered = true,
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

  const headerClasses = [styles.searchHeader, bordered ? styles.bordered : '', className || ''].join(' ').trim()

  return (
    <header className={headerClasses} style={style}>
      <div className={styles.searchHeader__container}>
        {title && <h3 className={styles.searchHeader__container__title}>{title}</h3>}
        <div className={styles.searchHeader__controls}>
          {menuItems && (
            <Dropdown menu={menuProps} trigger={['click']}>
              <Button className={styles.searchHeader__container__button}>
                <Space>
                  {selectedItemText}
                  <DownOutlined style={{ minWidth: '16px' }} />
                </Space>
              </Button>
            </Dropdown>
          )}
          {onSearch && (
            <Input.Search
              placeholder={searchPlaceholder}
              variant='filled'
              onChange={handleInputChange}
              value={searchValue}
              onSearch={handleSearch}
              onPressEnter={() => handleSearch(searchValue)}
            />
          )}
        </div>
      </div>

      {buttonComponent && <div>{buttonComponent}</div>}
    </header>
  )
}

export default SearchHeader
