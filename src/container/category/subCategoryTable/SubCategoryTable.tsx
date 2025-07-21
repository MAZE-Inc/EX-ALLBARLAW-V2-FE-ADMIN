import React from 'react'
import { Button } from 'antd'
import DraggableTable from '@/components/draggableTable'
import { createSubCategoryColumns } from '@/constants/categoryColumns'
import styles from './subCategoryTable.module.scss'

export interface SubCategoryData {
  key: string
  subCategory: string
  article: number
  video: number
  knowledge: number
  lawyer: number
}

interface SubCategoryTableProps {
  data: SubCategoryData[]
  onChangeOrder: (data: SubCategoryData[]) => void
  onAdd?: () => void
  onRowClick?: (record: SubCategoryData, index: number) => void
  onRowDoubleClick?: (record: SubCategoryData, index: number) => void
  mainCategory?: string
  onDelete?: (record: SubCategoryData) => void
}

const SubCategoryTable: React.FC<SubCategoryTableProps> = ({
  data,
  onChangeOrder,
  onAdd,
  onRowClick,
  onRowDoubleClick,
  mainCategory,
  onDelete,
}) => {
  // 삭제 함수를 포함한 컬럼 생성
  const columns = createSubCategoryColumns(onDelete)

  return mainCategory ? (
    <div className={styles.subCategoryTable}>
      <h3>대분류 &gt; {mainCategory}</h3>
      <Button onClick={onAdd} block type='primary' className={styles.addButton}>
        소분류 등록
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
  ) : (
    <div className={styles.categoryEmpty}>
      <h3>대분류를 선택하세요</h3>
    </div>
  )
}

export default SubCategoryTable
