import SearchHeader from '@/components/searchHeader/SearchHeader'
import styles from './lawyerMemberLayout.module.scss'
import { Outlet } from 'react-router-dom'

const LawyerMemberLayout = () => {
  return (
    <main>
      <section className={styles['admin-layout']}>
        <header>
          <SearchHeader className={styles['admin-layout__searchHeader']} bordered={false} title='' placeholder='선택' />
        </header>
        <article>
          <Outlet />
        </article>
      </section>
    </main>
  )
}

export default LawyerMemberLayout
