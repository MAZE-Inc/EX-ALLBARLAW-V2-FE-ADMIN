import { Button, Table, TableProps } from 'antd'
import styles from './memberList.module.scss'
import React from 'react'

type Member = {
  key: React.Key
  userId: string
  phoneNumber: string
  email: string
  createdAt: string
  isActive: boolean
}

const handleManageAccount = (userId: string) => {
  console.log(`계정 관리 버튼 클릭: ${userId}`)
  // TODO: 계정 관리 로직 (예: 모달 열기)
}

const columns: TableProps<Member>['columns'] = [
  {
    title: '아이디',
    dataIndex: 'userId',
    sorter: (a, b) => a.userId.localeCompare(b.userId),
  },
  {
    title: '인증 전화번호',
    dataIndex: 'phoneNumber',
    sorter: (a, b) => a.phoneNumber.localeCompare(b.phoneNumber),
  },
  {
    title: '이메일 주소',
    dataIndex: 'email',
    sorter: (a, b) => a.email.localeCompare(b.email),
  },
  {
    title: '가입일시',
    dataIndex: 'createdAt',
    sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  },
  {
    title: '계정관리',
    dataIndex: 'isActive',
    sorter: (a, b) => Number(a.isActive) - Number(b.isActive),
    render: (isActive: boolean, record: Member) => (
      <div className={styles['account-management-cell']}>
        <span>{isActive ? '사용중' : '정지'}</span>
        <Button size='small' onClick={() => handleManageAccount(record.userId)}>
          계정관리
        </Button>
      </div>
    ),
  },
]

const data: Member[] = [
  {
    key: 1,
    userId: 'user001',
    phoneNumber: '010-1234-5678',
    email: 'user001@example.com',
    createdAt: '2024-05-20 10:30',
    isActive: true,
  },
  {
    key: 2,
    userId: 'user002',
    phoneNumber: '010-8765-4321',
    email: 'user002@example.com',
    createdAt: '2024-05-19 14:00',
    isActive: false,
  },
  {
    key: 3,
    userId: 'user003',
    phoneNumber: '010-1111-2222',
    email: 'user003@example.com',
    createdAt: '2024-05-21 09:00',
    isActive: true,
  },
  {
    key: 4,
    userId: 'user004',
    phoneNumber: '010-3333-4444',
    email: 'user004@example.com',
    createdAt: '2024-05-18 18:45',
    isActive: true,
  },
]

const rowSelection = {
  // 체크박스 핸들러
  onChange: (selectedRowKeys: React.Key[], selectedRows: Member[]) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
  },
}

const MemberList = () => {
  return (
    <div className={styles['member-list-container']}>
      <Table<Member>
        columns={columns}
        dataSource={data}
        rowSelection={{
          ...rowSelection,
        }}
        pagination={{
          position: ['bottomCenter'],
        }}
      />
    </div>
  )
}

export default MemberList
