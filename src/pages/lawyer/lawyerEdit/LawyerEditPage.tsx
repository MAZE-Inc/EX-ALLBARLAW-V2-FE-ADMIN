import { useState, useRef } from 'react'
import { Button, Tabs, message } from 'antd'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import styles from './lawyerEdit.module.scss'
import LawyerEditBasicInfo, { LawyerEditBasicInfoRef } from '@/container/lawyer/lawyerEditBasicInfo/LawyerEditBasicInfo'
import LawyerEditActivity, { LawyerEditActivityRef } from '@/container/lawyer/lawyerEditActivity/LawyerEditActivity'
import LawyerEditCareer, { LawyerEditCareerRef } from '@/container/lawyer/lawyerEditCareer/LawyerEditCareer'
// import LawyerEditAchievements from '@/container/lawyer/lawyerEditAchievements/LawyerEditAchievements'
import { useLawyerBasicInfoUpdate, useLawyerCareerUpdate, useLawyerActivityUpdate } from '@/hooks/queries/useLawyer'
import { LawyerUpdateRequest } from '@/types/lawyerTypes'

const LawyerEditPage = () => {
  const navigate = useNavigate()
  const { lawyerId } = useParams<{ lawyerId: string }>()
  const { state } = useLocation()
  const [activeTab, setActiveTab] = useState('basic')
  const [isSaving, setIsSaving] = useState(false)

  // 각 탭 컴포넌트의 ref
  const basicInfoRef = useRef<LawyerEditBasicInfoRef>(null)
  const achievementsRef = useRef<any>(null)
  const careerRef = useRef<LawyerEditCareerRef>(null)
  const activityRef = useRef<LawyerEditActivityRef>(null)

  // 기본정보 업데이트 훅
  const updateBasicInfoMutation = useLawyerBasicInfoUpdate(
    Number(lawyerId),
    () => {
      message.success('기본정보가 저장되었습니다.')
      setIsSaving(false)
    },
    () => {
      message.error('저장 중 오류가 발생했습니다.')
      setIsSaving(false)
    }
  )

  // 이력사항 업데이트 훅
  const updateCareerMutation = useLawyerCareerUpdate(
    Number(lawyerId),
    () => {
      message.success('이력 사항이 저장되었습니다.')
      setIsSaving(false)
    },
    error => {
      const errorCode = error.status
      if (errorCode === 422) {
        message.error('이력 분류값 또는 이력 항목값이 입력되지 않았습니다. 모두 입력해주세요')
      } else {
        message.error('이력 사항 저장 중 오류가 발생했습니다.')
      }

      setIsSaving(false)
    }
  )

  // 활동사항 업데이트 훅
  const updateActivityMutation = useLawyerActivityUpdate(
    Number(lawyerId),
    () => {
      message.success('활동 사항이 저장되었습니다.')
      setIsSaving(false)
    },
    error => {
      const errorCode = error.status
      if (errorCode === 422) {
        message.error('활동 분류값 또는 활동 항목값이 입력되지 않았습니다. 모두 입력해주세요')
      } else {
        message.error('활동 사항 저장 중 오류가 발생했습니다.')
      }

      setIsSaving(false)
    }
  )

  const items = [
    {
      label: '변호사 기본정보',
      key: 'basic',
      children: <LawyerEditBasicInfo ref={basicInfoRef} lawyerId={lawyerId} />,
    },
    // { label: '업적 관리', key: 'achievements', children: <LawyerEditAchievements /> },
    { label: '이력 사항', key: 'career', children: <LawyerEditCareer ref={careerRef} lawyerId={lawyerId} /> },
    { label: '활동 사항', key: 'activity', children: <LawyerEditActivity ref={activityRef} lawyerId={lawyerId} /> },
  ]

  const handleCancel = () => {
    navigate(-1)
  }

  const handleSave = async () => {
    // mutation이 진행 중이거나 이미 저장 중인 경우 차단
    if (
      isSaving ||
      updateBasicInfoMutation.isPending ||
      updateCareerMutation.isPending ||
      updateActivityMutation.isPending
    ) {
      return
    }

    setIsSaving(true)

    try {
      switch (activeTab) {
        case 'basic':
          if (basicInfoRef.current) {
            // 유효성 검사 수행
            const isValid = basicInfoRef.current.validateForm()
            if (!isValid) {
              message.error('필수 입력 항목을 모두 입력해주세요.')
              setIsSaving(false)
              return
            }

            const formData = basicInfoRef.current.getFormData()
            const imageData = basicInfoRef.current.getImageData()

            // LawyerUpdateRequest 타입에 맞춰 데이터 구성
            const requestData: LawyerUpdateRequest = {
              // LawyerBasicInfo에서 상속받은 필드들 (Omit으로 제외된 필드 제외)
              lawyerDescription: formData.greeting || '',
              lawyerName: formData.lawyerName || '',
              lawyerBirthYear: formData.birthYear || 0,
              lawyerBirthMonth: formData.birthMonth || 0,
              lawyerBirthDay: formData.birthDay || 0,
              lawyerGender: formData.gender === 'M' ? 0 : 1,
              lawyerPhone: formData.phoneNumber || '',
              ...(formData.blogUrl && { lawyerBlogUrl: formData.blogUrl }),
              ...(formData.youtubeUrl && { lawyerYoutubeUrl: formData.youtubeUrl }),
              ...(formData.instagramUrl && { lawyerInstagramUrl: formData.instagramUrl }),
              lawyerLawfirmName: formData.lawfirmName || '',
              lawyerLawfirmAddress: formData.address || '',
              lawyerLawfirmAddressDetail: formData.addressDetail || '',
              lawyerLawfirmContact: formData.officePhone || '',
              lawyerSubcategories: formData.categories
                .filter((cat: any) => cat.subcategoryId)
                .map((cat: any) => ({
                  subcategoryId: cat.subcategoryId,
                  subcategoryName: '', // API에서 필요시 채워질 값
                })),

              // LawyerUpdateRequest 고유 필드들 (재정의된 필드)
              lawyerTags: formData.tags || [], // 문자열 배열
              lawyerProfileImages: imageData, // 구조화된 이미지 데이터 사용
            }

            // API 호출
            updateBasicInfoMutation.mutate(requestData)
          }
          break

        case 'achievements':
          if (achievementsRef.current) {
            // TODO: achievements 데이터 가져오기 및 API 호출
            message.success('업적 정보가 저장되었습니다.')
            setIsSaving(false)
          }
          break

        case 'career':
          if (careerRef.current) {
            const careerData = careerRef.current.getFormData()

            // 데이터 유효성 검사
            const hasEmptyCategory = careerData.some(
              item => !item.lawyerCareerCategoryName || item.lawyerCareerCategoryName.trim() === ''
            )
            if (hasEmptyCategory) {
              message.warning('이력 분류를 모두 입력해주세요.')
              setIsSaving(false)
              return
            }

            // API 호출
            updateCareerMutation.mutate(careerData)
          }
          break

        case 'activity':
          if (activityRef.current) {
            const activityData = activityRef.current.getFormData()

            // 데이터 유효성 검사
            const hasEmptyCategory = activityData.some(
              item => !item.lawyerActivityCategoryName || item.lawyerActivityCategoryName.trim() === ''
            )
            if (hasEmptyCategory) {
              message.warning('활동 분류를 모두 입력해주세요.')
              setIsSaving(false)
              return
            }

            // API 호출
            updateActivityMutation.mutate(activityData)
          }
          break
      }
    } catch (error) {
      message.error('저장 중 오류가 발생했습니다.')
      console.error(error)
      setIsSaving(false)
    }
  }

  return (
    <>
      <header className={styles['lawyer-edit__header']}>
        <h1 className={styles['lawyer-edit__header-title']}>{state?.lawyerName} 변호사의 활동사항 화면입니다.</h1>
        <div className={styles['lawyer-edit__header-actions']}>
          <Button onClick={handleCancel}>취소</Button>
          <Button
            type='primary'
            onClick={handleSave}
            loading={
              isSaving ||
              updateBasicInfoMutation.isPending ||
              updateCareerMutation.isPending ||
              updateActivityMutation.isPending
            }
            disabled={
              updateBasicInfoMutation.isPending || updateCareerMutation.isPending || updateActivityMutation.isPending
            }
          >
            변경완료
          </Button>
        </div>
      </header>
      <main className='sub-main-container' style={{ padding: '16px' }}>
        <Tabs items={items} activeKey={activeTab} onChange={setActiveTab} />
      </main>
    </>
  )
}

export default LawyerEditPage
