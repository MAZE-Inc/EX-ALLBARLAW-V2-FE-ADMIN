import { Table, TableProps, Button } from 'antd'
import styles from './managerList.module.scss'
import { Admin } from '@/types/adminTypes'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTE_PATH } from '@/routes/routePath'

interface ManagerListProps {
  type: 'total' | 'admin-manager' | 'cs-manager'
  data: Admin[]
  loading?: boolean
  onSort?: (field: keyof Admin) => void
  currentOrderBy?: keyof Admin
  currentSort?: 'asc' | 'desc'
}

const ManagerList = ({ data, loading, onSort, currentOrderBy, currentSort }: ManagerListProps) => {
  const navigate = useNavigate()
  const [selectedRows, setSelectedRows] = useState<Admin[]>([])

  const getSortOrder = (field: keyof Admin) => {
    if (!currentOrderBy || !onSort) return undefined
    if (field !== currentOrderBy) return undefined
    return currentSort === 'asc' ? 'ascend' : 'descend'
  }

  const handleEdit = (record: Admin) => {
    navigate(`${ROUTE_PATH.ADMIN_MANAGEMENT}/${ROUTE_PATH.ADMIN_REGISTER}/${record.adminId}`, {
      state: { adminData: record },
    })
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
    {
      title: '관리',
      key: 'action',
      render: (_, record) => (
        <Button size='small' onClick={() => handleEdit(record)}>
          수정
        </Button>
      ),
    },
  ]

  const rowSelection = {
    selectedRowKeys: selectedRows.map(row => row.adminId),
    onSelectAll: (selected: boolean, selectedRows: Admin[]) => {
      setSelectedRows(selected ? selectedRows : [])
      console.log('전체 선택:', selected, selectedRows)
    },
    onSelect: (record: Admin, selected: boolean) => {
      setSelectedRows(prev => {
        if (selected) {
          return [...prev, record]
        } else {
          return prev.filter(row => row.adminId !== record.adminId)
        }
      })
      console.log('개별 선택:', record, selected)
    },
    getCheckboxProps: (record: Admin) => ({
      name: record.adminAccount,
    }),
  }

  return (
    <div className={styles['manager-list-container']}>
      <Table<Admin>
        columns={columns}
        dataSource={data}
        rowSelection={rowSelection}
        rowKey='adminId'
        pagination={{
          position: ['bottomCenter'],
        }}
        loading={loading}
        onChange={() => {}} // 정렬은 헤더 클릭으로 처리
        onRow={record => ({
          onClick: event => {
            // 체크박스나 버튼 클릭 시에는 행 클릭 이벤트 무시
            const target = event.target as HTMLElement
            if (
              target.tagName === 'INPUT' ||
              target.tagName === 'BUTTON' ||
              target.closest('button') ||
              target.closest('.ant-checkbox-wrapper')
            ) {
              return
            }
            handleEdit(record)
          },
          style: { cursor: 'pointer' },
        })}
      />
    </div>
  )
}

export default ManagerList
