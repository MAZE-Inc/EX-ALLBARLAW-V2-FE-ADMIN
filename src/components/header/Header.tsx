import React from 'react'
import { Button } from 'antd'
import { MenuOutlined, CloseOutlined } from '@ant-design/icons'
import styles from './header.module.scss'

interface HeaderProps {
  onToggle: () => void
  collapsed: boolean
}

const Header: React.FC<HeaderProps> = ({ onToggle, collapsed }) => {
  return (
    <header className={styles.header}>
      <Button
        className={styles.toggleButton}
        type='text'
        icon={collapsed ? <MenuOutlined /> : <CloseOutlined />}
        onClick={onToggle}
      />
    </header>
  )
}

export default Header
