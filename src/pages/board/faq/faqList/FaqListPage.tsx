import { Button, Table } from 'antd'
import { useState } from 'react'
import styles from './faqList.module.scss'
import EditFaqCategoryModal from '@/container/board/editFaqCategoryModal/EditFaqCategoryModal'

const FaqListPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <div style={{ padding: 24 }}>
      <section className={styles.faqListPage__buttonContainer}>
        <Button onClick={showModal}>FAQ 분류 설정</Button>
        <Button>FAQ 등록</Button>
      </section>
      <Table />
      <EditFaqCategoryModal isModalVisible={isModalVisible} onCancle={handleCancel} />
    </div>
  )
}

export default FaqListPage
