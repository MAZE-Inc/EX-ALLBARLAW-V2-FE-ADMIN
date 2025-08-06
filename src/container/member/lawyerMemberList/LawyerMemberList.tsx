import React, { useState } from 'react'
import { Button, Table, TableProps } from 'antd'
import styles from './lawyerMemberList.module.scss'
import { useNavigate } from 'react-router-dom'
import { ROUTE_PATH } from '@/routes/routePath'
import LawyerApprovalModal from '@/components/lawyerApprovalModal/LawyerApprovalModal'

// 변호사 멤버 타입 정의
interface LawyerMember {
  lawyerId: number
  lawyerAccount: string
  lawyerEmail: string
  lawyerName: string
  lawyerPhone: string
  lawyerOffice: string
  lawyerOfficePhone: string
  lawyerExam: string
  lawyerApproved: boolean
  lawyerCreatedAt: string
}

interface LawyerMemberListProps {
  data: LawyerMember[]
  loading?: boolean
  onSort: (field: string) => void
  currentOrderBy: string
  currentSort: 'asc' | 'desc'
}

const LawyerMemberList = ({ data, loading, onSort, currentOrderBy, currentSort }: LawyerMemberListProps) => {
  const [selectedRows, setSelectedRows] = useState<LawyerMember[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedLawyer, setSelectedLawyer] = useState<LawyerMember | null>(null)
  const navigate = useNavigate()

  // Convert API sort type to Ant Design sort type
  const getSortOrder = (field: string) => {
    if (field !== currentOrderBy) return undefined
    return currentSort === 'asc' ? 'ascend' : 'descend'
  }

  const handleApprovalInfo = (lawyer: LawyerMember, e: React.MouseEvent) => {
    e.stopPropagation() // 이벤트 버블링 방지
    setSelectedLawyer(lawyer)
    setModalVisible(true)
  }

  const handleModalClose = () => {
    setModalVisible(false)
    setSelectedLawyer(null)
  }

  const handleModalSubmit = (data: any) => {
    console.log('승인정보 저장:', data)
    // API 호출 로직 추가
    handleModalClose()
  }

  const columns: TableProps<LawyerMember>['columns'] = [
    {
      title: '아이디',
      dataIndex: 'lawyerAccount',
      sorter: true,
      sortOrder: getSortOrder('account'),
      onHeaderCell: () => ({
        onClick: () => onSort('account'),
      }),
    },
    {
      title: '이메일 주소',
      dataIndex: 'lawyerEmail',
      sorter: true,
      sortOrder: getSortOrder('email'),
      onHeaderCell: () => ({
        onClick: () => onSort('email'),
      }),
    },
    {
      title: '변호사 이름',
      dataIndex: 'lawyerName',
      sorter: true,
      sortOrder: getSortOrder('name'),
      onHeaderCell: () => ({
        onClick: () => onSort('name'),
      }),
    },
    {
      title: '연락처',
      dataIndex: 'lawyerPhone',
      sorter: true,
      sortOrder: getSortOrder('phone'),
      onHeaderCell: () => ({
        onClick: () => onSort('phone'),
      }),
    },
    {
      title: '소속',
      dataIndex: 'lawyerOffice',
      sorter: true,
      sortOrder: getSortOrder('office'),
      onHeaderCell: () => ({
        onClick: () => onSort('office'),
      }),
    },
    {
      title: '소속연락처',
      dataIndex: 'lawyerOfficePhone',
      sorter: true,
      sortOrder: getSortOrder('officePhone'),
      onHeaderCell: () => ({
        onClick: () => onSort('officePhone'),
      }),
    },
    {
      title: '출신 시험',
      dataIndex: 'lawyerExam',
      sorter: true,
      sortOrder: getSortOrder('exam'),
      onHeaderCell: () => ({
        onClick: () => onSort('exam'),
      }),
    },
    {
      title: '승인여부',
      dataIndex: 'lawyerApproved',
      render: (isApproved: boolean, record: LawyerMember) => (
        <div className={styles['approval-cell']}>
          <span>{isApproved ? '승인' : '미승인'}</span>
          <Button size='small' onClick={e => handleApprovalInfo(record, e)}>
            승인정보
          </Button>
        </div>
      ),
    },
  ]

  const rowSelection = {
    selectedRowKeys: selectedRows.map(row => row.lawyerId),
    onSelectAll: (selected: boolean, selectedRows: LawyerMember[]) => {
      setSelectedRows(selected ? selectedRows : [])
      console.log('전체 선택:', selected, selectedRows)
    },
    onSelect: (record: LawyerMember, selected: boolean) => {
      setSelectedRows(prev => {
        if (selected) {
          return [...prev, record]
        } else {
          return prev.filter(row => row.lawyerId !== record.lawyerId)
        }
      })
      console.log('개별 선택:', record, selected)
    },
    getCheckboxProps: (record: LawyerMember) => ({
      name: record.lawyerAccount,
    }),
  }

  return (
    <div className={styles['lawyer-member-list-container']}>
      <Table<LawyerMember>
        columns={columns}
        dataSource={data}
        rowSelection={rowSelection}
        rowKey='lawyerId'
        pagination={false}
        loading={loading}
        onChange={() => {}} // 정렬은 헤더 클릭으로 처리
        onRow={record => ({
          onClick: () => navigate(`${ROUTE_PATH.LAWYER_MEMBER}/${record.lawyerId}`, { state: { lawyerInfo: record } }),
        })}
      />
      <LawyerApprovalModal
        open={modalVisible}
        onCancel={handleModalClose}
        onSubmit={handleModalSubmit}
        defaultValues={{
          approvalStatus: selectedLawyer?.lawyerApproved ? 'approved' : 'pending',
        }}
      />
    </div>
  )
}

export default LawyerMemberList
