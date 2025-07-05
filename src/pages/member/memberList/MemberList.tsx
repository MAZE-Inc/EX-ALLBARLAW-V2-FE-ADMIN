import { Button, Table, TableProps } from 'antd'
import styles from './memberList.module.scss'
import React from 'react'
import { Member } from '@/types/memberType'

interface MemberListProps {
  data: Member[]
  loading?: boolean
}

const handleManageAccount = (userId: string) => {
  console.log(`계정 관리 버튼 클릭: ${userId}`)
}

const columns: TableProps<Member>['columns'] = [
  {
    title: '아이디',
    dataIndex: 'userAccount',
    sorter: (a, b) => a.userAccount.localeCompare(b.userAccount),
  },
  {
    title: '인증 전화번호',
    dataIndex: 'userPhone',
    sorter: (a, b) => a.userPhone.localeCompare(b.userPhone),
  },
  {
    title: '이메일 주소',
    dataIndex: 'userEmail',
    sorter: (a, b) => a.userEmail.localeCompare(b.userEmail),
  },
  {
    title: '가입일시',
    dataIndex: 'userCreatedAt',
    sorter: (a, b) => new Date(a.userCreatedAt).getTime() - new Date(b.userCreatedAt).getTime(),
  },
  {
    title: '계정관리',
    dataIndex: 'userIsActive',
    sorter: (a, b) => Number(a.userIsActive) - Number(b.userIsActive),
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

const MemberList = ({ data, loading }: MemberListProps) => {
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
      />
    </div>
  )
}

export default MemberList
