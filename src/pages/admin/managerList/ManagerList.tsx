import { Table, TableProps } from 'antd'
import styles from './managerList.module.scss'
import { Admin } from '@/types/adminTypes'

interface ManagerListProps {
  type: 'total' | 'admin-manager' | 'cs-manager'
  data: Admin[]
  loading?: boolean
  onSort?: (field: keyof Admin) => void
  currentOrderBy?: keyof Admin
  currentSort?: 'asc' | 'desc'
}

const ManagerList = ({ data, loading, onSort, currentOrderBy, currentSort }: ManagerListProps) => {
  const getSortOrder = (field: keyof Admin) => {
    if (!currentOrderBy || !onSort) return undefined
    if (field !== currentOrderBy) return undefined
    return currentSort === 'asc' ? 'ascend' : 'descend'
  }

  const columns: TableProps<Admin>['columns'] = [
    {
      title: '계정구분',
      dataIndex: 'adminAccountTypeId',
      key: 'adminAccountTypeId',
      render: (typeId: number) => (typeId === 1 ? '통합 관리자' : 'CS 관리자'),
      sorter: true,
      sortOrder: getSortOrder('adminAccountTypeId'),
      onHeaderCell: () => ({
        onClick: () => onSort?.('adminAccountTypeId'),
      }),
    },
    {
      title: '아이디',
      dataIndex: 'adminAccount',
      key: 'adminAccount',
      sorter: true,
      sortOrder: getSortOrder('adminAccount'),
      onHeaderCell: () => ({
        onClick: () => onSort?.('adminAccount'),
      }),
    },
    {
      title: '이메일 주소',
      dataIndex: 'adminEmail',
      key: 'adminEmail',
      sorter: true,
      sortOrder: getSortOrder('adminEmail'),
      onHeaderCell: () => ({
        onClick: () => onSort?.('adminEmail'),
      }),
    },
    {
      title: '계정이름',
      dataIndex: 'adminName',
      key: 'adminName',
      sorter: true,
      sortOrder: getSortOrder('adminName'),
      onHeaderCell: () => ({
        onClick: () => onSort?.('adminName'),
      }),
    },
    {
      title: '계정사용 여부',
      dataIndex: 'adminIsActive',
      key: 'adminIsActive',
      render: (isActive: boolean) => (isActive ? '사용' : '미사용'),
      sorter: true,
      sortOrder: getSortOrder('adminIsActive'),
      onHeaderCell: () => ({
        onClick: () => onSort?.('adminIsActive'),
      }),
    },
  ]

  const rowSelection = {
    onSelectAll: (selected: boolean, selectedRows: Admin[]) => {
      console.log('전체 선택:', selected, selectedRows)
    },
    onSelect: (record: Admin, selected: boolean) => {
      console.log('개별 선택:', record, selected)
    },
  }

  return (
    <div className={styles['manager-list-container']}>
      <Table<Admin>
        columns={columns}
        dataSource={data}
        rowSelection={rowSelection}
        pagination={{
          position: ['bottomCenter'],
        }}
        loading={loading}
        onChange={() => {}} // 정렬은 헤더 클릭으로 처리
      />
    </div>
  )
}

export default ManagerList
