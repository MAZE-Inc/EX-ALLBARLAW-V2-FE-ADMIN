import { useEffect } from 'react'
import DaumPostcode from 'react-daum-postcode'
import styles from './addressSearchModal.module.scss'

interface AddressData {
  address: string
  zonecode: string
}

interface AddressSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (data: AddressData) => void
}

const AddressSearchModal = ({ isOpen, onClose, onComplete }: AddressSearchModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleComplete = (data: any) => {
    let fullAddress = data.address
    let extraAddress = ''

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : ''
    }

    onComplete({
      address: fullAddress,
      zonecode: data.zonecode,
    })
    onClose()
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>주소 검색</h2>
          <button type='button' onClick={onClose} className={styles.closeButton}>
            ✕
          </button>
        </div>
        <div className={styles.content}>
          <DaumPostcode onComplete={handleComplete} style={{ height: '100%' }} />
        </div>
      </div>
    </div>
  )
}

export default AddressSearchModal
