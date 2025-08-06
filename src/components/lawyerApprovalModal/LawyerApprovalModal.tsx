import React, { useState } from 'react'
import { Button, Input, Modal, Select, Radio, Space } from 'antd'
import { UploadOutlined, CloseOutlined } from '@ant-design/icons'
import styles from './lawyerApprovalModal.module.scss'

interface LawyerApprovalModalProps {
  open: boolean
  onCancel: () => void
  onSubmit: (data: {
    lawSchoolDiploma: File | null
    lawyerLicense: File | null
    passingYear: string
    passingMonth: string
    passingDay: string
    approvalStatus: 'pending' | 'approved'
  }) => void
  defaultValues?: {
    lawSchoolDiploma?: string
    lawyerLicense?: string
    passingYear?: string
    passingMonth?: string
    passingDay?: string
    approvalStatus?: 'pending' | 'approved'
  }
}

const LawyerApprovalModal: React.FC<LawyerApprovalModalProps> = ({ open, onCancel, onSubmit, defaultValues }) => {
  const [lawSchoolDiplomaFile, setLawSchoolDiplomaFile] = useState<File | null>(null)
  const [lawyerLicenseFile, setLawyerLicenseFile] = useState<File | null>(null)
  const [lawSchoolDiplomaPreview, setLawSchoolDiplomaPreview] = useState<string>('')
  const [lawyerLicensePreview, setLawyerLicensePreview] = useState<string>('')
  const [passingYear, setPassingYear] = useState('')
  const [passingMonth, setPassingMonth] = useState('')
  const [passingDay, setPassingDay] = useState('')
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved'>('pending')

  React.useEffect(() => {
    if (open) {
      setLawSchoolDiplomaFile(null)
      setLawyerLicenseFile(null)
      setLawSchoolDiplomaPreview(defaultValues?.lawSchoolDiploma || '')
      setLawyerLicensePreview(defaultValues?.lawyerLicense || '')
      setPassingYear(defaultValues?.passingYear || '')
      setPassingMonth(defaultValues?.passingMonth || '')
      setPassingDay(defaultValues?.passingDay || '')
      setApprovalStatus(defaultValues?.approvalStatus || 'pending')
    }
  }, [open, defaultValues])

  const handleSubmit = () => {
    onSubmit({
      lawSchoolDiploma: lawSchoolDiplomaFile,
      lawyerLicense: lawyerLicenseFile,
      passingYear,
      passingMonth,
      passingDay,
      approvalStatus,
    })
    handleCancel()
  }

  const handleCancel = () => {
    setLawSchoolDiplomaFile(null)
    setLawyerLicenseFile(null)
    setLawSchoolDiplomaPreview('')
    setLawyerLicensePreview('')
    setPassingYear('')
    setPassingMonth('')
    setPassingDay('')
    setApprovalStatus('pending')
    onCancel()
  }

  const handleLawSchoolDiplomaUpload = (info: any) => {
    const file = info.target.files?.[0]
    if (file) {
      setLawSchoolDiplomaFile(file)
      const reader = new FileReader()
      reader.onload = e => {
        setLawSchoolDiplomaPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLawyerLicenseUpload = (info: any) => {
    const file = info.target.files?.[0]
    if (file) {
      setLawyerLicenseFile(file)
      const reader = new FileReader()
      reader.onload = e => {
        setLawyerLicensePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLawSchoolDiploma = () => {
    setLawSchoolDiplomaFile(null)
    setLawSchoolDiplomaPreview('')
  }

  const removeLawyerLicense = () => {
    setLawyerLicenseFile(null)
    setLawyerLicensePreview('')
  }

  // 연도, 월, 일 옵션 생성
  const yearOptions = Array.from({ length: 30 }, (_, i) => ({
    value: (2024 - i).toString(),
    label: (2024 - i).toString(),
  }))

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString().padStart(2, '0'),
    label: (i + 1).toString().padStart(2, '0'),
  }))

  const dayOptions = Array.from({ length: 31 }, (_, i) => ({
    value: (i + 1).toString().padStart(2, '0'),
    label: (i + 1).toString().padStart(2, '0'),
  }))

  return (
    <Modal
      title='변호사 승인 정보'
      open={open}
      onCancel={handleCancel}
      width={700}
      footer={
        <>
          <Button onClick={handleCancel}>취소</Button>
          <Button type='primary' onClick={handleSubmit} style={{ backgroundColor: '#20bf62', borderColor: '#20bf62' }}>
            저장하기
          </Button>
        </>
      }
    >
      <div className={styles.lawyerApprovalModal}>
        <div className={styles.formRow}>
          <label>로스쿨 졸업장</label>
          <div className={styles.fileUploadContainer}>
            <Input
              placeholder='첨부파일을 선택해주세요'
              value={lawSchoolDiplomaPreview ? '첨부파일이 선택되었습니다' : ''}
              readOnly
            />
            <Button icon={<UploadOutlined />} onClick={() => document.getElementById('lawSchoolDiplomaInput')?.click()}>
              첨부파일
            </Button>
            <input
              type='file'
              id='lawSchoolDiplomaInput'
              accept='.pdf,.doc,.docx'
              onChange={handleLawSchoolDiplomaUpload}
              style={{ display: 'none' }}
            />
          </div>
          {lawSchoolDiplomaPreview && (
            <div className={styles.attachedFile}>
              <span className={styles.fileName}>첨부파일 : 김서울 서울대 로스쿨 졸업장.pdf</span>
              <CloseOutlined className={styles.removeIcon} onClick={removeLawSchoolDiploma} />
            </div>
          )}
        </div>

        <div className={styles.formRow}>
          <label>변호사 자격증</label>
          <div className={styles.fileUploadContainer}>
            <Input
              placeholder='첨부파일을 선택해주세요'
              value={lawyerLicensePreview ? '첨부파일이 선택되었습니다' : ''}
              readOnly
            />
            <Button icon={<UploadOutlined />} onClick={() => document.getElementById('lawyerLicenseInput')?.click()}>
              첨부파일
            </Button>
            <input
              type='file'
              id='lawyerLicenseInput'
              accept='.pdf,.doc,.docx'
              onChange={handleLawyerLicenseUpload}
              style={{ display: 'none' }}
            />
          </div>
          {lawyerLicensePreview && (
            <div className={styles.attachedFile}>
              <span className={styles.fileName}>첨부파일 : 김서울 변호사 자격증.pdf</span>
              <CloseOutlined className={styles.removeIcon} onClick={removeLawyerLicense} />
            </div>
          )}
        </div>

        <div className={styles.formRow}>
          <label>변호사 합격일자</label>
          <div className={styles.dateContainer}>
            <Select
              placeholder='연도 선택'
              value={passingYear}
              onChange={setPassingYear}
              options={yearOptions}
              style={{ width: 120 }}
            />
            <Select
              placeholder='월'
              value={passingMonth}
              onChange={setPassingMonth}
              options={monthOptions}
              style={{ width: 80 }}
            />
            <Select
              placeholder='일'
              value={passingDay}
              onChange={setPassingDay}
              options={dayOptions}
              style={{ width: 80 }}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <label>승인 여부</label>
          <Radio.Group value={approvalStatus} onChange={e => setApprovalStatus(e.target.value)}>
            <Space direction='vertical'>
              <Radio value='pending'>대기</Radio>
              <Radio value='approved'>승인 완료</Radio>
            </Space>
          </Radio.Group>
        </div>
      </div>
    </Modal>
  )
}

export default LawyerApprovalModal
