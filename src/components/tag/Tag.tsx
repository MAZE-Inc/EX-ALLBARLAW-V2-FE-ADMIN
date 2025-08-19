import styles from '@/components/tag/tag.module.scss'

type TagProps = {
  tag: string
  onClick?: () => void
  className?: string
}

const Tag = ({ tag, onClick, className }: TagProps) => {
  return (
    <span
      className={`${styles['tag']} ${className || ''}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {tag}
    </span>
  )
}

export default Tag
