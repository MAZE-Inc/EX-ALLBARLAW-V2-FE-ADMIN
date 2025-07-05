import { Button, Table, TableProps } from 'antd'
import styles from './memberList.module.scss'
import React from 'react'
import { Member, MemberListRequest } from '@/types/memberType'

interface MemberListProps {
  data: Member[]
  loading?: boolean
  onSort: (field: MemberListRequest['orderBy']) => void
}

const handleManageAccount = (userId: string) => {
  console.log(`계정 관리 버튼 클릭: ${userId}`)
}

const MemberList = ({ data, loading, onSort }: MemberListProps) => {
  const columns: TableProps<Member>['columns'] = [
    {
      title: '아이디',
      dataIndex: 'userAccount',
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => onSort('account'),
      }),
    },
    {
      title: '인증 전화번호',
      dataIndex: 'userPhone',
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => onSort('phone'),
      }),
    },
    {
      title: '이메일 주소',
      dataIndex: 'userEmail',
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => onSort('email'),
      }),
    },
    {
      title: '가입일시',
      dataIndex: 'userCreatedAt',
      sorter: true,
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
    onChange: (selectedRowKeys: React.Key[], selectedRows: Member[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
    },
  }

  return (
    <div className={styles['member-list-container']}>
      <Table<Member>
        columns={columns}
        dataSource={data}
        rowSelection={{
          ...rowSelection,
        }}
        pagination={false}
        loading={loading}
        onChange={() => {}} // 정렬은 헤더 클릭으로 처리
      />
    </div>
  )
}

export default MemberList
