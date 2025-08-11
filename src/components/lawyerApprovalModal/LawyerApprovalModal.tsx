import React, { useState } from 'react'
import { Button, Input, Modal, Select, Radio, Space, message } from 'antd'
import { UploadOutlined, CloseOutlined } from '@ant-design/icons'
import styles from './lawyerApprovalModal.module.scss'
import { useFileUpload } from '@/hooks/useFileUpload'
import { useUpdateLawyerRegister } from '@/hooks/queries/useMember'

interface LawyerApprovalModalProps {
  open: boolean
  onCancel: () => void
  onSubmit?: (data: any) => void
  lawyerId: number | null
  defaultValues?: {
    lawSchoolDiploma?: string
    lawyerLicense?: string
    passingDate?: string
    approvalStatus?: 'pending' | 'approved'
  }
}

const LawyerApprovalModal: React.FC<LawyerApprovalModalProps> = ({
  open,
  onCancel,
  onSubmit,
  defaultValues,
  lawyerId,
}) => {
  const [lawSchoolDiplomaFile, setLawSchoolDiplomaFile] = useState<File | null>(null)
  const [lawyerLicenseFile, setLawyerLicenseFile] = useState<File | null>(null)
  const [lawSchoolDiplomaUrl, setLawSchoolDiplomaUrl] = useState<string>('')
  const [lawyerLicenseUrl, setLawyerLicenseUrl] = useState<string>('')
  const [passingYear, setPassingYear] = useState('')
  const [passingMonth, setPassingMonth] = useState('')
  const [passingDay, setPassingDay] = useState('')
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved'>('pending')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 초기값 저장용 state
  const [initialValues, setInitialValues] = useState<{
    lawSchoolDiploma: string
    lawyerLicense: string
    passingYear: string
    passingMonth: string
    passingDay: string
    approvalStatus: 'pending' | 'approved'
  }>({
    lawSchoolDiploma: '',
    lawyerLicense: '',
    passingYear: '',
    passingMonth: '',
    passingDay: '',
    approvalStatus: 'pending',
  })

  const { uploadFile } = useFileUpload()
  const updateLawyerRegister = useUpdateLawyerRegister({
    onSuccess: () => {
      message.success('변호사 승인 정보가 업데이트되었습니다.')
      onCancel()
    },
    onError: error => {
      message.error('업데이트에 실패했습니다.')
      console.error(error)
    },
  })

  React.useEffect(() => {
    if (open) {
      setLawSchoolDiplomaFile(null)
      setLawyerLicenseFile(null)

      const diplomaUrl = defaultValues?.lawSchoolDiploma || ''
      const licenseUrl = defaultValues?.lawyerLicense || ''
      let year = ''
      let month = ''
      let day = ''

      // 날짜 파싱
      if (defaultValues?.passingDate) {
        const date = new Date(defaultValues.passingDate)
        year = date.getFullYear().toString()
        month = (date.getMonth() + 1).toString().padStart(2, '0')
        day = date.getDate().toString().padStart(2, '0')
      }

      const status = defaultValues?.approvalStatus || 'pending'

      // 현재 값 설정
      setLawSchoolDiplomaUrl(diplomaUrl)
      setLawyerLicenseUrl(licenseUrl)
      setPassingYear(year)
      setPassingMonth(month)
      setPassingDay(day)
      setApprovalStatus(status)

      // 초기값 저장
      setInitialValues({
        lawSchoolDiploma: diplomaUrl,
        lawyerLicense: licenseUrl,
        passingYear: year,
        passingMonth: month,
        passingDay: day,
        approvalStatus: status,
      })
    }
  }, [open, defaultValues])

  // 값이 변경되었는지 확인하는 함수
  const hasChanges = () => {
    // 새 파일이 선택되었으면 변경된 것
    if (lawSchoolDiplomaFile || lawyerLicenseFile) {
      return true
    }

    // 기존 값과 현재 값 비교
    return (
      lawSchoolDiplomaUrl !== initialValues.lawSchoolDiploma ||
      lawyerLicenseUrl !== initialValues.lawyerLicense ||
      passingYear !== initialValues.passingYear ||
      passingMonth !== initialValues.passingMonth ||
      passingDay !== initialValues.passingDay ||
      approvalStatus !== initialValues.approvalStatus
    )
  }

  const handleSubmit = async () => {
    if (!lawyerId) {
      message.error('변호사 ID가 없습니다.')
      return
    }

    try {
      setIsSubmitting(true)

      let finalLawSchoolDiplomaUrl = lawSchoolDiplomaUrl
      let finalLawyerLicenseUrl = lawyerLicenseUrl

      // 파일 업로드 처리
      if (lawSchoolDiplomaFile) {
        const result = await uploadFile(lawSchoolDiplomaFile, {
          folder: 'lawyer/lawyerLawSchoolDiplomaUrl',
        })
        finalLawSchoolDiplomaUrl = result.fileUrl
      }

      if (lawyerLicenseFile) {
        const result = await uploadFile(lawyerLicenseFile, {
          folder: 'lawyer/certificateUrl',
        })
        finalLawyerLicenseUrl = result.fileUrl
      }

      // 승인 완료를 선택한 경우, 필수 정보 확인
      if (approvalStatus === 'approved') {
        const hasAllRequiredFields =
          finalLawSchoolDiplomaUrl && finalLawyerLicenseUrl && passingYear && passingMonth && passingDay

        if (!hasAllRequiredFields) {
          message.error('승인 완료를 위해서는 로스쿨 졸업장, 변호사 자격증, 변호사 합격일자를 모두 입력해야 합니다.')
          setIsSubmitting(false)
          return
        }
      }

      // API 요청 데이터 구성
      const requestData = {
        ...(finalLawSchoolDiplomaUrl && { lawyerLawSchoolDiplomaUrl: finalLawSchoolDiplomaUrl }),
        ...(finalLawyerLicenseUrl && { lawyerCertificateUrl: finalLawyerLicenseUrl }),
        ...(approvalStatus === 'pending' && { lawyerApprovalStatus: 1 as const }), // 대기 -> 1
        ...(approvalStatus === 'approved' && { lawyerApprovalStatus: 2 as const }), // 승인완료 -> 2
        ...(passingYear && { barExamPassYear: parseInt(passingYear) }),
        ...(passingMonth && { barExamPassMonth: parseInt(passingMonth) }),
        ...(passingDay && { barExamPassDay: parseInt(passingDay) }),
      }

      // 변호사 정보 업데이트
      await updateLawyerRegister.mutateAsync({
        lawyerId,
        request: requestData,
      })

      if (onSubmit) {
        onSubmit(requestData)
      }

      handleCancel()
    } catch (error) {
      console.error('Submit error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setLawSchoolDiplomaFile(null)
    setLawyerLicenseFile(null)
    setLawSchoolDiplomaUrl('')
    setLawyerLicenseUrl('')
    setPassingYear('')
    setPassingMonth('')
    setPassingDay('')
    setApprovalStatus('pending')
    setIsSubmitting(false)
    onCancel()
  }

  const handleLawSchoolDiplomaUpload = (info: any) => {
    const file = info.target.files?.[0]
    if (file) {
      setLawSchoolDiplomaFile(file)
      const reader = new FileReader()
      reader.onload = e => {
        setLawSchoolDiplomaUrl(e.target?.result as string)
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
        setLawyerLicenseUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLawSchoolDiploma = () => {
    setLawSchoolDiplomaFile(null)
    setLawSchoolDiplomaUrl('')
  }

  const removeLawyerLicense = () => {
    setLawyerLicenseFile(null)
    setLawyerLicenseUrl('')
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
          <Button onClick={handleCancel} disabled={isSubmitting}>
            취소
          </Button>
          <Button
            type='primary'
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={!hasChanges() || isSubmitting}
            style={{ backgroundColor: '#20bf62', borderColor: '#20bf62' }}
          >
            저장하기
          </Button>
        </>
      }
    >
      <div className={styles.lawyerApprovalModal}>
        <div className={styles.formRow}>
          <label>로스쿨 졸업장</label>
          <div>
            <div className={styles.fileUploadContainer}>
              <Input
                placeholder='첨부파일을 선택해주세요'
                value={lawSchoolDiplomaFile ? lawSchoolDiplomaFile.name : ''}
                readOnly
              />
              <Button
                icon={<UploadOutlined />}
                onClick={() => document.getElementById('lawSchoolDiplomaInput')?.click()}
              >
                첨부파일
              </Button>
              <input
                type='file'
                id='lawSchoolDiplomaInput'
                accept='image/*,.pdf,.doc,.docx'
                onChange={handleLawSchoolDiplomaUpload}
                style={{ display: 'none' }}
              />
            </div>
            {lawSchoolDiplomaUrl && !lawSchoolDiplomaFile && (
              <div style={{ marginTop: '8px' }}>
                <span
                  style={{ color: 'red', textDecoration: 'underline', fontSize: '14px', cursor: 'pointer' }}
                  onClick={() => window.open(lawSchoolDiplomaUrl, '_blank')}
                >
                  {lawSchoolDiplomaUrl.split('/').pop() || '기존 파일'}
                </span>
                <CloseOutlined
                  style={{ marginLeft: '8px', fontSize: '12px', color: 'red', cursor: 'pointer' }}
                  onClick={removeLawSchoolDiploma}
                />
              </div>
            )}
            {lawSchoolDiplomaFile && (
              <div style={{ marginTop: '8px' }}>
                <span style={{ color: '#52c41a', fontSize: '14px' }}>
                  새 파일: {lawSchoolDiplomaFile.name}
                  <CloseOutlined
                    style={{ marginLeft: '8px', fontSize: '12px', color: '#52c41a' }}
                    onClick={removeLawSchoolDiploma}
                  />
                </span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.formRow}>
          <label>변호사 자격증</label>
          <div>
            <div className={styles.fileUploadContainer}>
              <Input
                placeholder='첨부파일을 선택해주세요'
                value={lawyerLicenseFile ? lawyerLicenseFile.name : ''}
                readOnly
              />
              <Button icon={<UploadOutlined />} onClick={() => document.getElementById('lawyerLicenseInput')?.click()}>
                첨부파일
              </Button>
              <input
                type='file'
                id='lawyerLicenseInput'
                accept='image/*,.pdf,.doc,.docx'
                onChange={handleLawyerLicenseUpload}
                style={{ display: 'none' }}
              />
            </div>
            {lawyerLicenseUrl && !lawyerLicenseFile && (
              <div style={{ marginTop: '8px' }}>
                <span
                  style={{ color: 'red', textDecoration: 'underline', fontSize: '14px', cursor: 'pointer' }}
                  onClick={() => window.open(lawyerLicenseUrl, '_blank')}
                >
                  {lawyerLicenseUrl.split('/').pop() || '기존 파일'}
                </span>
                <CloseOutlined
                  style={{ marginLeft: '8px', fontSize: '12px', color: 'red', cursor: 'pointer' }}
                  onClick={removeLawyerLicense}
                />
              </div>
            )}
            {lawyerLicenseFile && (
              <div style={{ marginTop: '8px' }}>
                <span style={{ color: '#52c41a', fontSize: '14px' }}>
                  새 파일: {lawyerLicenseFile.name}
                  <CloseOutlined
                    style={{ marginLeft: '8px', fontSize: '12px', color: '#52c41a' }}
                    onClick={removeLawyerLicense}
                  />
                </span>
              </div>
            )}
          </div>
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
