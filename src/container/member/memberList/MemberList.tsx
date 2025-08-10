import React, { useState } from 'react'
import { Button, Table, TableProps } from 'antd'
import styles from './memberList.module.scss'
import { Member, MemberListRequest } from '@/types/memberType'
import AccountManagementModal from '@/components/accountManagementModal/AccountManagementModal'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { ROUTE_PATH } from '@/routes/routePath'

interface MemberListProps {
  data: Member[]
  loading?: boolean
  onSort: (field: MemberListRequest['orderBy']) => void
  currentOrderBy: MemberListRequest['orderBy']
  currentSort: MemberListRequest['sort']
  onSelectionChange?: (selectedRows: Member[]) => void
}

const MemberList = ({ data, loading, onSort, currentOrderBy, currentSort, onSelectionChange }: MemberListProps) => {
  const [selectedRows, setSelectedRows] = useState<Member[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState<Member | null>(null)
  const navigate = useNavigate()

  const handleManageAccount = (user: Member, e: React.MouseEvent) => {
    e.stopPropagation() // 이벤트 버블링 방지
    setSelectedUser(user)
    setModalVisible(true)
  }

  const handleModalClose = () => {
    setModalVisible(false)
    setSelectedUser(null)
  }

  // Convert API sort type to Ant Design sort type
  const getSortOrder = (field: MemberListRequest['orderBy']) => {
    if (field !== currentOrderBy) return undefined
    return currentSort === 'asc' ? 'ascend' : 'descend'
  }

  const columns: TableProps<Member>['columns'] = [
    {
      title: '아이디',
      dataIndex: 'userAccount',
      sorter: true,
      sortOrder: getSortOrder('account'),
      onHeaderCell: () => ({
        onClick: () => onSort('account'),
      }),
    },
    {
      title: '인증 전화번호',
      dataIndex: 'userPhone',
      sorter: true,
      sortOrder: getSortOrder('phone'),
      onHeaderCell: () => ({
        onClick: () => onSort('phone'),
      }),
    },
    {
      title: '이메일 주소',
      dataIndex: 'userEmail',
      sorter: true,
      sortOrder: getSortOrder('email'),
      onHeaderCell: () => ({
        onClick: () => onSort('email'),
      }),
    },
    {
      title: '가입일시',
      dataIndex: 'userCreatedAt',
      sorter: true,
      sortOrder: getSortOrder('createdAt'),
      onHeaderCell: () => ({
        onClick: () => onSort('createdAt'),
      }),
      width: 150,
      render: (value: string) => (value ? dayjs(value).format('YY-MM-DD HH:mm') : ''),
    },
    {
      title: '계정관리',
      dataIndex: 'userIsActive',
      render: (isActive: boolean, record: Member) => (
        <div className={styles['account-management-cell']}>
          <span>{isActive ? '사용중' : '정지'}</span>
          <Button size='small' onClick={e => handleManageAccount(record, e)}>
            계정관리
          </Button>
        </div>
      ),
    },
  ]

  const rowSelection = {
    selectedRowKeys: selectedRows.map(row => row.userId),
    onSelectAll: (selected: boolean, selectedRows: Member[]) => {
      const newSelectedRows = selected ? selectedRows : []
      setSelectedRows(newSelectedRows)
      onSelectionChange?.(newSelectedRows)
      console.log('전체 선택:', selected, selectedRows)
    },
    onSelect: (record: Member, selected: boolean) => {
      setSelectedRows(prev => {
        const newSelectedRows = selected ? [...prev, record] : prev.filter(row => row.userId !== record.userId)
        onSelectionChange?.(newSelectedRows)
        return newSelectedRows
      })
      console.log('개별 선택:', record, selected)
    },
    getCheckboxProps: (record: Member) => ({
      name: record.userAccount,
    }),
  }

  return (
    <div className={styles['member-list-container']}>
      <Table<Member>
        columns={columns}
        dataSource={data}
        rowSelection={rowSelection}
        rowKey='userId'
        pagination={false}
        loading={loading}
        onChange={() => {}} // 정렬은 헤더 클릭으로 처리
        onRow={record => ({
          onClick: () => navigate(`${ROUTE_PATH.MEMBER}/${record.userId}`, { state: { userInfo: record } }),
        })}
      />
      {selectedUser && (
        <AccountManagementModal
          visible={modalVisible}
          onClose={handleModalClose}
          accountInfo={{
            userId: selectedUser.userId,
            userIsActive: selectedUser.userIsActive,
            userBanReason: selectedUser.userBanReason || null,
          }}
        />
      )}
    </div>
  )
}

export default MemberList
