import { useState } from 'react'
import { message } from 'antd'
import { useLawyerSearch } from '@/hooks/queries/useLawyer'

export const useLawyerSelection = () => {
  const [lawyerSearchName, setLawyerSearchName] = useState('')
  const [isLawyerModalOpen, setIsLawyerModalOpen] = useState(false)
  const [selectedLawyerId, setSelectedLawyerId] = useState<number | null>(null)
  const [modalSearchQuery, setModalSearchQuery] = useState('')
  const [searchTrigger, setSearchTrigger] = useState({ query: '', trigger: 0 })

  const { data: searchData, isLoading } = useLawyerSearch({
    searchQuery: searchTrigger.query,
    searchType: 'lawyerName',
  })

  const handleSelectLawyer = () => {
    if (lawyerSearchName.trim()) {
      setModalSearchQuery(lawyerSearchName)
      setSearchTrigger({ query: lawyerSearchName, trigger: Date.now() })
      setIsLawyerModalOpen(true)
    }
  }

  const handleModalSearch = () => {
    if (modalSearchQuery.trim()) {
      setSearchTrigger({ query: modalSearchQuery, trigger: Date.now() })
    }
  }

  const handleLawyerSelect = (lawyerId: number, onSuccess?: (lawyer: any) => void) => {
    const lawyers = searchData?.lawyerSearchResults || []
    const selected = lawyers.find(lawyer => lawyer.lawyerId === lawyerId)

    if (selected) {
      onSuccess?.(selected)
      setIsLawyerModalOpen(false)
      setSelectedLawyerId(null)
      setModalSearchQuery('')
      message.success('변호사가 선택되었습니다.')
    }
  }

  const handleModalCancel = () => {
    setIsLawyerModalOpen(false)
    setSelectedLawyerId(null)
    setModalSearchQuery('')
  }

  return {
    lawyerSearchName,
    setLawyerSearchName,
    isLawyerModalOpen,
    modalSearchQuery,
    setModalSearchQuery,
    searchData,
    isLoading,
    selectedLawyerId,
    handleSelectLawyer,
    handleModalSearch,
    handleLawyerSelect,
    handleModalCancel,
  }
}