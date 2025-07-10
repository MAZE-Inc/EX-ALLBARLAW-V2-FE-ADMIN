import { Button, Table, TableProps } from 'antd'
import styles from './memberList.module.scss'
import { useState } from 'react'
import { Member, MemberListRequest } from '@/types/memberType'

interface MemberListProps {
  data: Member[]
  loading?: boolean
  onSort: (field: MemberListRequest['orderBy']) => void
  currentOrderBy: MemberListRequest['orderBy']
  currentSort: MemberListRequest['sort']
}

const handleManageAccount = (userId: string) => {
  console.log(`계정 관리 버튼 클릭: ${userId}`)
}

const MemberList = ({ data, loading, onSort, currentOrderBy, currentSort }: MemberListProps) => {
  const [selectedRows, setSelectedRows] = useState<Member[]>([])

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
    },
    {
      title: '계정관리',
      dataIndex: 'userIsActive',
      render: (isActive: boolean, record: Member) => (
        <div className={styles['account-management-cell']}>
          <span>{isActive ? '사용중' : '정지'}</span>
          <Button size='small' onClick={() => handleManageAccount(record.userId.toString())}>
            계정관리
          </Button>
        </div>
      ),
    },
  ]

  const rowSelection = {
    selectedRowKeys: selectedRows.map(row => row.userId),
    onSelectAll: (selected: boolean, selectedRows: Member[]) => {
      setSelectedRows(selected ? selectedRows : [])
      console.log('전체 선택:', selected, selectedRows)
    },
    onSelect: (record: Member, selected: boolean) => {
      setSelectedRows(prev => {
        if (selected) {
          return [...prev, record]
        } else {
          return prev.filter(row => row.userId !== record.userId)
        }
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
      />
    </div>
  )
}

export default MemberList
