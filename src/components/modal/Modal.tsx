import React, { createContext, useContext, ReactNode, useEffect } from 'react'
import styles from './modal.module.scss'

interface ModalContextType {
  isOpen: boolean
  onClose: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

const useModalContext = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('Modal compound components must be used within Modal')
  }
  return context
}

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string
  type?: 'default' | 'alert'
}

const Modal = ({ isOpen, onClose, children, className, type = 'default' }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때 body 스크롤 막기
      document.body.style.overflow = 'hidden'
    } else {
      // 모달이 닫힐 때 body 스크롤 복원
      document.body.style.overflow = ''
    }

    // 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <ModalContext.Provider value={{ isOpen, onClose }}>
      <div className={styles.overlay} onClick={handleOverlayClick}>
        <div className={`${styles.modal} ${type === 'alert' ? styles.modalAlert : ''} ${className || ''}`}>
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  )
}

interface ModalHeaderProps {
  children: ReactNode
  showCloseButton?: boolean
  className?: string
}

const ModalHeader = ({ children, showCloseButton = true, className }: ModalHeaderProps) => {
  const { onClose } = useModalContext()

  return (
    <div className={`${styles.header} ${className || ''}`}>
      <div className={styles.title}>{children}</div>
      {showCloseButton && (
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
      )}
    </div>
  )
}

interface ModalBodyProps {
  children: ReactNode
  className?: string
}

const ModalBody = ({ children, className }: ModalBodyProps) => {
  return <div className={`${styles.body} ${className || ''}`}>{children}</div>
}

interface ModalFooterProps {
  children: ReactNode
  className?: string
}

const ModalFooter = ({ children, className }: ModalFooterProps) => {
  return <div className={`${styles.footer} ${className || ''}`}>{children}</div>
}

// Alert 타입을 위한 간편 컴포넌트
interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  message: string
  confirmText?: string
  className?: string
}

export const AlertModal = ({ isOpen, onClose, message, confirmText = '확인', className }: AlertModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} type='alert' className={className}>
      <Modal.Body>
        <div className={styles.alertContent}>{message}</div>
      </Modal.Body>
      <Modal.Footer>
        <button className={styles.alertButton} onClick={onClose}>
          {confirmText}
        </button>
      </Modal.Footer>
    </Modal>
  )
}

Modal.Header = ModalHeader
Modal.Body = ModalBody
Modal.Footer = ModalFooter

export default Modal
