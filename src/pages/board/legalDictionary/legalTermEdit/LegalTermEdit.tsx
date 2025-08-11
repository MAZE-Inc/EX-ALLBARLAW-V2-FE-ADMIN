import { Button, Input, Space } from 'antd'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { message } from 'antd'
import { ROUTE_PATH } from '@/routes/routePath'
import { useCreateLegalTerm, useUpdateLegalTerm, useLegalTermDetail } from '@/hooks/queries/useLegalTerm'
import { CreateLegalTermRequest, UpdateLegalTermRequest } from '@/types/legalTermTypes'
import styles from './legalTermEdit.module.scss'

const { TextArea } = Input

const LegalTermEdit = () => {
  const navigate = useNavigate()
  const { termId } = useParams()
  const location = useLocation()
  const isEditMode = Boolean(termId)
  
  const [formData, setFormData] = useState<CreateLegalTermRequest>({
    koreanName: '',
    englishName: '',
    chineseName: '',
    source: '',
    content: '',
  })

  // API 훅 설정
  const { data: termDetail, isLoading: isLoadingDetail } = useLegalTermDetail(
    isEditMode ? Number(termId) : 0
  )

  const { mutate: createLegalTerm, isPending: isCreating } = useCreateLegalTerm({
    onSuccess: () => {
      message.success('법률 용어가 등록되었습니다.')
      // 목록 페이지로 이동하면서 현재 페이지를 히스토리에서 교체
      navigate(ROUTE_PATH.BOARD_LEGAL_DICTIONARY, { replace: true })
    },
    onError: () => {
      message.error('등록에 실패했습니다.')
    },
  })

  const { mutate: updateLegalTerm, isPending: isUpdating } = useUpdateLegalTerm({
    onSuccess: () => {
      message.success('법률 용어가 수정되었습니다.')
      // 히스토리를 조작하여 상세 페이지와 수정 페이지를 제거
      // 목록 -> 상세 -> 수정 상태에서 목록으로 바로 이동
      if (window.history.length > 2) {
        // 두 단계 뒤로 이동 (상세 페이지와 수정 페이지를 건너뛰기)
        window.history.go(-2)
      } else {
        // 히스토리가 충분하지 않으면 목록으로 이동
        navigate(ROUTE_PATH.BOARD_LEGAL_DICTIONARY, { replace: true })
      }
    },
    onError: () => {
      message.error('수정에 실패했습니다.')
    },
  })

  // 편집 모드일 때 데이터 불러오기
  useEffect(() => {
    if (isEditMode && termDetail) {
      setFormData({
        koreanName: termDetail.koreanName,
        englishName: termDetail.englishName,
        chineseName: termDetail.chineseName,
        source: termDetail.source,
        content: termDetail.content,
      })
    } else if (isEditMode && location.state?.termDetail) {
      // location.state로 전달된 데이터가 있으면 사용
      const passedData = location.state.termDetail
      setFormData({
        koreanName: passedData.koreanName,
        englishName: passedData.englishName,
        chineseName: passedData.chineseName,
        source: passedData.source,
        content: passedData.content,
      })
    }
  }, [isEditMode, termDetail, location.state])

  const handleSave = () => {
    // 유효성 검증
    if (!formData.koreanName.trim()) {
      message.error('한글 용어명을 입력해주세요.')
      return
    }
    
    if (!formData.englishName.trim()) {
      message.error('영문 용어명을 입력해주세요.')
      return
    }
    
    if (!formData.chineseName.trim()) {
      message.error('한문 용어명을 입력해주세요.')
      return
    }
    
    if (!formData.source.trim()) {
      message.error('출처를 입력해주세요.')
      return
    }
    
    if (!formData.content.trim()) {
      message.error('용어 설명을 입력해주세요.')
      return
    }

    if (isEditMode && termId) {
      // 수정 모드
      const updateRequest: UpdateLegalTermRequest = {
        id: Number(termId),
        ...formData,
      }
      updateLegalTerm(updateRequest)
    } else {
      // 등록 모드
      createLegalTerm(formData)
    }
  }

  const handleCancel = () => {
    navigate(-1)
  }

  const handleInputChange = (field: keyof CreateLegalTermRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const isLoading = isCreating || isUpdating || isLoadingDetail
  
  // 모든 필드가 입력되었는지 확인
  const isFormValid = () => {
    return (
      formData.koreanName.trim() !== '' &&
      formData.englishName.trim() !== '' &&
      formData.chineseName.trim() !== '' &&
      formData.source.trim() !== '' &&
      formData.content.trim() !== ''
    )
  }

  return (
    <div className={styles.legalTermEditPage}>
      <section className={styles.legalTermEditPage__form}>
        <div className={styles.formRow}>
          <div className={styles.labelCol}>
            <label className={styles.label}>한글 용어명</label>
          </div>
          <div className={styles.inputCol}>
            <Input
              placeholder='한글 용어명을 입력해 주세요'
              size='large'
              className={styles.input}
              value={formData.koreanName}
              onChange={e => handleInputChange('koreanName', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.labelCol}>
            <label className={styles.label}>영문 용어명</label>
          </div>
          <div className={styles.inputCol}>
            <Input
              placeholder='영문 용어명을 입력해 주세요'
              size='large'
              className={styles.input}
              value={formData.englishName}
              onChange={e => handleInputChange('englishName', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.labelCol}>
            <label className={styles.label}>한문 용어명</label>
          </div>
          <div className={styles.inputCol}>
            <Input
              placeholder='한문 용어명을 입력해 주세요'
              size='large'
              className={styles.input}
              value={formData.chineseName}
              onChange={e => handleInputChange('chineseName', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.labelCol}>
            <label className={styles.label}>출처</label>
          </div>
          <div className={styles.inputCol}>
            <Input
              placeholder='출처를 자세하게 입력해 주세요'
              size='large'
              className={styles.input}
              value={formData.source}
              onChange={e => handleInputChange('source', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.labelCol}>
            <label className={styles.label}>용어 설명</label>
          </div>
          <div className={styles.inputCol}>
            <TextArea
              placeholder='용어 설명을 작성해주세요...'
              rows={10}
              size='large'
              className={styles.textArea}
              value={formData.content}
              onChange={e => handleInputChange('content', e.target.value)}
              style={{ resize: 'none' }}
            />
          </div>
        </div>

        <div className={styles.legalTermEditPage__actions}>
          <Space className={styles.buttonSpace}>
            <Button 
              onClick={handleCancel} 
              size='large' 
              className={styles.cancelButton}
            >
              취소
            </Button>
            <Button
              type='primary'
              loading={isLoading}
              size='large'
              className={styles.saveButton}
              disabled={!isFormValid()}
              onClick={handleSave}
            >
              {isEditMode ? '수정 완료' : '용어 등록'}
            </Button>
          </Space>
        </div>
      </section>
    </div>
  )
}

export default LegalTermEdit