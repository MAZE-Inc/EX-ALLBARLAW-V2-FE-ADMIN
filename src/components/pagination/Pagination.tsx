import styles from './pagination.module.scss'

interface PaginationProps {
  totalPages: number
  onPageChange: (page: number) => void
  currentPage?: number
  className?: string
}

export const Pagination = ({ totalPages, onPageChange, currentPage = 1, className }: PaginationProps) => {
  return (
    <div className={`${styles.pagination} ${className}`}>
      <div className={styles.pageInfo}>
        {currentPage} / {totalPages}
      </div>
      <div className={styles.controls}>
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={styles.arrowButton}
        >
          &lt;
        </button>
        <button
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={styles.arrowButton}
        >
          &gt;
        </button>
      </div>
    </div>
  )
}
