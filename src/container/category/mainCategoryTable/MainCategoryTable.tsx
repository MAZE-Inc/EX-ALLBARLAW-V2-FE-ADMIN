import React from 'react'
import { Button } from 'antd'
import DraggableTable from '@/components/draggableTable'
import { createMainCategoryColumns } from '@/constants/categoryColumns'
import styles from './mainCategoryTable.module.scss'

export interface MainCategoryData {
  key: string
  mainCategory: string
  icons: string[]
  subCategory: number
  displayOrder?: number
}

interface MainCategoryTableProps {
  data: MainCategoryData[]
  onChangeOrder: (data: MainCategoryData[]) => void
  onAdd?: () => void
  onRowClick?: (record: MainCategoryData, index: number) => void
  onRowDoubleClick?: (record: MainCategoryData, index: number) => void
  onDelete?: (record: MainCategoryData) => void
}

const MainCategoryTable: React.FC<MainCategoryTableProps> = ({
  data,
  onChangeOrder,
  onAdd,
  onRowClick,
  onRowDoubleClick,
  onDelete,
}) => {
  // 삭제 함수를 포함한 컬럼 생성
  const columns = createMainCategoryColumns(onDelete)

  return (
    <div className={styles.mainCategoryTable}>
      <h3>대분류를 선택하세요</h3>
      <Button onClick={onAdd} block type='primary' className={styles.addButton}>
        대분류 등록
      </Button>
      <DraggableTable
        columns={columns}
        dataSource={data}
        rowKey='key'
        onChangeOrder={onChangeOrder}
        onRowClick={onRowClick}
        onRowDoubleClick={onRowDoubleClick}
      />
    </div>
  )
}

export default MainCategoryTable
