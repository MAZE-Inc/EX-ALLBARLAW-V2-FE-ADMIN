import { useState, useEffect } from 'react'
import { Modal, Space, Input, Button, Table, message } from 'antd'
import { useLawyerSearch } from '@/hooks/queries/useLawyer'

interface LawyerSearchModalProps {
  open: boolean
  onCancel: () => void
  onSelect: (lawyer: any) => void
  initialSearchQuery?: string
}

const LawyerSearchModal = ({ open, onCancel, onSelect, initialSearchQuery = '' }: LawyerSearchModalProps) => {
  const [modalSearchQuery, setModalSearchQuery] = useState('')
  const [searchTrigger, setSearchTrigger] = useState({ query: '', trigger: 0 })

  // Reset search when modal opens
  useEffect(() => {
    if (open) {
      setModalSearchQuery(initialSearchQuery)
      if (initialSearchQuery) {
        setSearchTrigger({ query: initialSearchQuery, trigger: Date.now() })
      }
    }
  }, [open, initialSearchQuery])

  // API hook
  const { data: searchData, isLoading } = useLawyerSearch({
    searchQuery: searchTrigger.query,
    searchType: 'lawyerName',
  })

  const handleModalSearch = () => {
    if (modalSearchQuery.trim()) {
      setSearchTrigger({ query: modalSearchQuery, trigger: Date.now() })
    }
  }

  const handleLawyerSelect = (lawyerId: number) => {
    const lawyers = searchData?.lawyerSearchResults || []
    const selected = lawyers.find(lawyer => lawyer.lawyerId === lawyerId)
    if (selected) {
      onSelect(selected)
      message.success('변호사가 선택되었습니다.')
      handleClose()
    }
  }

  const handleClose = () => {
    setModalSearchQuery('')
    setSearchTrigger({ query: '', trigger: 0 })
    onCancel()
  }

  const columns = [
    {
      title: '변호사 사진',
      dataIndex: 'lawyerProfileImage',
      key: 'lawyerProfileImage',
      width: 100,
      render: (image: string | null, record: any) => (
        <div
          style={{
            width: 60,
            height: 60,
            backgroundColor: '#f0f0f0',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            color: '#999',
          }}
        >
          {image ? (
            <img
              src={image}
              alt={record.lawyerName}
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <span>👤</span>
          )}
        </div>
      ),
    },
    {
      title: '변호사명',
      dataIndex: 'lawyerName',
      key: 'lawyerName',
      width: 150,
    },
    {
      title: '소속',
      dataIndex: 'lawyerLawfirmName',
      key: 'lawyerLawfirmName',
      render: (value: string | null) => value || '-',
    },
    {
      title: '가입일자',
      dataIndex: 'lawyerCreatedAt',
      key: 'lawyerCreatedAt',
      width: 120,
      render: (value: string) => {
        if (!value) return '-'
        const date = new Date(value)
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(
          2,
          '0'
        )}`
      },
    },
    {
      title: '선택',
      key: 'action',
      width: 100,
      render: (_: any, record: any) => (
        <Button
          type='primary'
          onClick={() => handleLawyerSelect(record.lawyerId)}
          style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
        >
          선택하기
        </Button>
      ),
    },
  ]

  return (
    <Modal title='변호사 이름 검색' open={open} onCancel={handleClose} width={900} footer={null}>
      <div style={{ marginBottom: 16 }}>
        <Space.Compact style={{ width: '100%' }}>
          <Input
            placeholder='변호사 이름을 검색해주세요'
            value={modalSearchQuery}
            onChange={e => setModalSearchQuery(e.target.value)}
            onPressEnter={handleModalSearch}
            size='large'
            style={{ flex: 1 }}
          />
          <Button type='primary' size='large' onClick={handleModalSearch} style={{ width: 100 }}>
            검색
          </Button>
        </Space.Compact>
      </div>

      <Table
        dataSource={searchData?.lawyerSearchResults || []}
        rowKey='lawyerId'
        loading={isLoading}
        pagination={false}
        locale={{ emptyText: modalSearchQuery ? '검색 결과가 없습니다.' : '변호사 이름을 검색해주세요.' }}
        columns={columns}
      />
    </Modal>
  )
}

export default LawyerSearchModal
