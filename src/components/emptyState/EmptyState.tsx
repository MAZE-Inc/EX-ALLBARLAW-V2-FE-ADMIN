import React from 'react'
import styles from './emptyState.module.scss'

interface EmptyStateProps {
  icon?: string | React.ReactNode
  message: string
  className?: string
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon = '📝', message, className }) => {
  return (
    <div className={`${styles.emptyState} ${className || ''}`}>
      <div className={styles.emptyIcon}>{icon}</div>
      <p className={styles.emptyMessage}>{message}</p>
    </div>
  )
}

export default EmptyState