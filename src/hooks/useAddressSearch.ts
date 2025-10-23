import { useState } from 'react'

interface UseAddressSearchReturn {
  isOpen: boolean
  openAddressSearch: () => void
  closeAddressSearch: () => void
}

export const useAddressSearch = (): UseAddressSearchReturn => {
  const [isOpen, setIsOpen] = useState(false)

  const openAddressSearch = () => {
    setIsOpen(true)
  }

  const closeAddressSearch = () => {
    setIsOpen(false)
  }

  return {
    isOpen,
    openAddressSearch,
    closeAddressSearch,
  }
}
