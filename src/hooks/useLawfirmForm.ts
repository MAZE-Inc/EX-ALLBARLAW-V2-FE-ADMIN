import { useState, useCallback, useEffect } from 'react'
import { LawfirmApiRequest } from '@/types/lawfirmTypes'
import { message } from 'antd'

interface UseLawfirmFormProps {
  initialData?: Partial<LawfirmApiRequest>
}

interface FieldErrors {
  lawfirmEmail?: string
  lawfirmContact?: string
  lawfirmHomepageUrl?: string
  lawfirmBlogUrl?: string
}

export const useLawfirmForm = ({ initialData }: UseLawfirmFormProps = {}) => {
  const [formData, setFormData] = useState<LawfirmApiRequest>({
    lawfirmId: 0,
    lawfirmName: '',
    lawfirmEmail: '',
    lawfirmContact: '',
    lawfirmViewCount: 0,
    lawfirmSubcategoryId: 0,
    lawfirmDirects: [],
    lawfirmImages: [],
    ...initialData,
  })

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  // URL 유효성 검증 함수
  const isValidUrl = (url: string): boolean => {
    if (!url) return true
    if (url.startsWith('/')) return true

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return false
    }

    try {
      const urlObj = new URL(url)
      if (urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1') {
        return false
      }
      if (!urlObj.hostname || urlObj.hostname.length === 0) {
        return false
      }
      return true
    } catch {
      return false
    }
  }

  // 전화번호 포맷팅 함수
  const formatPhoneNumber = (value: string, prevValue: string): string => {
    // 숫자만 추출
    const numbers = value.replace(/[^0-9]/g, '')

    // 빈 문자열이면 그대로 반환
    if (!numbers) return ''

    // 백스페이스를 감지 (이전 값보다 짧아진 경우)
    const isDeleting = value.length < prevValue.length

    // 백스페이스로 하이픈을 지우려고 하는 경우, 하이픈 앞의 숫자도 함께 제거
    if (isDeleting && prevValue.endsWith('-') && !value.endsWith('-')) {
      return formatPhoneNumber(numbers.slice(0, -1), '')
    }

    // 전화번호 형식에 따라 하이픈 추가
    if (numbers.length <= 3) {
      return numbers
    } else if (numbers.startsWith('02')) {
      // 서울 지역번호 (02)
      if (numbers.length <= 2) {
        return numbers
      } else if (numbers.length <= 6) {
        return numbers.slice(0, 2) + '-' + numbers.slice(2)
      } else if (numbers.length <= 10) {
        return numbers.slice(0, 2) + '-' + numbers.slice(2, 6) + '-' + numbers.slice(6)
      } else {
        return numbers.slice(0, 2) + '-' + numbers.slice(2, 6) + '-' + numbers.slice(6, 10)
      }
    } else if (numbers.startsWith('01')) {
      // 휴대폰 번호
      if (numbers.length <= 3) {
        return numbers
      } else if (numbers.length <= 7) {
        return numbers.slice(0, 3) + '-' + numbers.slice(3)
      } else if (numbers.length <= 11) {
        return numbers.slice(0, 3) + '-' + numbers.slice(3, 7) + '-' + numbers.slice(7)
      } else {
        return numbers.slice(0, 3) + '-' + numbers.slice(3, 7) + '-' + numbers.slice(7, 11)
      }
    } else {
      // 기타 지역번호 (031, 032, 033 등)
      if (numbers.length <= 3) {
        return numbers
      } else if (numbers.length <= 6) {
        return numbers.slice(0, 3) + '-' + numbers.slice(3)
      } else if (numbers.length <= 10) {
        return numbers.slice(0, 3) + '-' + numbers.slice(3, 7) + '-' + numbers.slice(7)
      } else {
        return numbers.slice(0, 3) + '-' + numbers.slice(3, 7) + '-' + numbers.slice(7, 11)
      }
    }
  }

  // 전화번호의 이전 값을 저장하기 위한 ref
  const [prevPhone, setPrevPhone] = useState('')

  // 입력값 변경 핸들러
  const handleInputChange = useCallback((field: keyof LawfirmApiRequest, value: any) => {
    let processedValue = value

    // 전화번호 필드인 경우 자동 포맷팅
    if (field === 'lawfirmContact') {
      processedValue = formatPhoneNumber(value, prevPhone)
      setPrevPhone(processedValue)
    }

    setFormData(prev => ({
      ...prev,
      [field]: processedValue,
    }))

    // 실시간 유효성 검증
    if (field === 'lawfirmEmail' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        setFieldErrors(prev => ({ ...prev, lawfirmEmail: '올바른 이메일 형식을 입력해주세요.' }))
      } else {
        setFieldErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.lawfirmEmail
          return newErrors
        })
      }
    }

    if (field === 'lawfirmContact' && processedValue) {
      const phoneRegex = /^(0[2-8][0-5]?|01[016789]|070|080)-?\d{3,4}-?\d{4}$/
      const cleanedValue = processedValue.replace(/[^0-9-]/g, '')
      if (!phoneRegex.test(cleanedValue)) {
        setFieldErrors(prev => ({
          ...prev,
          lawfirmContact: '올바른 전화번호 형식을 입력해주세요. (예: 02-1234-5678, 010-1234-5678)'
        }))
      } else {
        setFieldErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.lawfirmContact
          return newErrors
        })
      }
    }

    if ((field === 'lawfirmHomepageUrl' || field === 'lawfirmBlogUrl') && value) {
      if (!isValidUrl(value)) {
        setFieldErrors(prev => ({
          ...prev,
          [field]: '올바른 URL 형식을 입력해주세요. (http://, https:// 또는 /)'
        }))
      } else {
        setFieldErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors[field]
          return newErrors
        })
      }
    }
  }, [prevPhone])

  // 폼 유효성 검증
  const validateForm = useCallback((localDirects?: Array<{ name: string; link: string }>, selectedSubCategory?: number) => {
    const errors: string[] = []
    let hasError = false

    // 필수값 검증
    if (!formData.lawfirmName?.trim()) errors.push('로펌 이름')
    if (!formData.lawfirmEmail?.trim()) errors.push('로펌 이메일')
    if (!formData.lawfirmContact?.trim()) errors.push('로펌 연락처')
    if (!selectedSubCategory) errors.push('분류 선택')

    if (errors.length > 0) {
      message.error(`다음 필수 항목을 입력해주세요: ${errors.join(', ')}`)
      return false
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.lawfirmEmail && !emailRegex.test(formData.lawfirmEmail)) {
      message.error('올바른 이메일 형식을 입력해주세요.')
      hasError = true
    }

    // 전화번호 형식 검증
    const phoneRegex = /^(0[2-8][0-5]?|01[016789]|070|080)-?\d{3,4}-?\d{4}$/
    const cleanedPhone = formData.lawfirmContact.replace(/[^0-9-]/g, '')
    if (formData.lawfirmContact && !phoneRegex.test(cleanedPhone)) {
      message.error('올바른 전화번호 형식을 입력해주세요. (예: 02-1234-5678, 010-1234-5678)')
      hasError = true
    }

    // URL 형식 검증
    if (formData.lawfirmHomepageUrl && !isValidUrl(formData.lawfirmHomepageUrl)) {
      message.error('올바른 홈페이지 URL 형식을 입력해주세요.')
      hasError = true
    }
    if (formData.lawfirmBlogUrl && !isValidUrl(formData.lawfirmBlogUrl)) {
      message.error('올바른 블로그 URL 형식을 입력해주세요.')
      hasError = true
    }

    // 바로가기 링크 이름/URL 쌍 검증
    if (localDirects) {
      const hasIncompleteDirect = localDirects.some(direct => {
        return (direct.name && !direct.link) || (!direct.name && direct.link)
      })
      if (hasIncompleteDirect) {
        message.error('바로가기 링크의 이름과 URL을 모두 입력해주세요.')
        hasError = true
      }
    }

    return !hasError
  }, [formData])

  // 폼 데이터 준비 (API 제출용)
  const prepareSubmitData = useCallback((
    selectedCategory?: number,
    selectedSubCategory?: number
  ): LawfirmApiRequest => {
    const submitData: LawfirmApiRequest = {
      lawfirmId: formData.lawfirmId,
      lawfirmName: formData.lawfirmName,
      lawfirmEmail: formData.lawfirmEmail,
      lawfirmContact: formData.lawfirmContact.replace(/-/g, ''), // 하이픈 제거
      lawfirmViewCount: formData.lawfirmViewCount,
      lawfirmDirects: formData.lawfirmDirects,
      lawfirmImages: formData.lawfirmImages,
    }

    // 서브카테고리가 선택된 경우에만 추가
    if (selectedSubCategory) {
      submitData.lawfirmSubcategoryId = selectedSubCategory
    }

    // 카테고리가 선택된 경우에만 추가
    if (selectedCategory) {
      submitData.lawfirmCategoryId = selectedCategory
    }

    // 선택적 필드는 값이 있을 때만 추가
    if (formData.lawfirmAddress?.trim()) {
      submitData.lawfirmAddress = formData.lawfirmAddress.trim()
    }
    if (formData.lawfirmGreetingTitle?.trim()) {
      submitData.lawfirmGreetingTitle = formData.lawfirmGreetingTitle.trim()
    }
    if (formData.lawfirmGreetingContent?.trim()) {
      submitData.lawfirmGreetingContent = formData.lawfirmGreetingContent.trim()
    }
    if (formData.lawfirmHomepageUrl?.trim()) {
      submitData.lawfirmHomepageUrl = formData.lawfirmHomepageUrl.trim()
    }
    if (formData.lawfirmLogoImageUrl?.trim()) {
      submitData.lawfirmLogoImageUrl = formData.lawfirmLogoImageUrl.trim()
    }
    if (formData.lawfirmBlogUrl?.trim()) {
      submitData.lawfirmBlogUrl = formData.lawfirmBlogUrl.trim()
    }

    return submitData
  }, [formData])

  // 초기 데이터로 폼 설정
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
      }))
    }
  }, [initialData])

  // 폼이 유효한지 실시간 체크 (버튼 비활성화용)
  const isFormValid = useCallback(() => {
    // 필수 필드 체크
    if (!formData.lawfirmName?.trim()) return false
    if (!formData.lawfirmEmail?.trim()) return false
    if (!formData.lawfirmContact?.trim()) return false

    // 에러 상태 체크
    if (Object.keys(fieldErrors).length > 0) return false

    // 이메일 형식 체크
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.lawfirmEmail && !emailRegex.test(formData.lawfirmEmail)) return false

    // 전화번호 형식 체크
    const phoneRegex = /^(0[2-8][0-5]?|01[016789]|070|080)-?\d{3,4}-?\d{4}$/
    const cleanedPhone = formData.lawfirmContact.replace(/[^0-9-]/g, '')
    if (formData.lawfirmContact && !phoneRegex.test(cleanedPhone)) return false

    // URL 형식 체크 (선택사항이지만 입력된 경우)
    if (formData.lawfirmHomepageUrl && !isValidUrl(formData.lawfirmHomepageUrl)) return false
    if (formData.lawfirmBlogUrl && !isValidUrl(formData.lawfirmBlogUrl)) return false

    return true
  }, [formData, fieldErrors])

  return {
    formData,
    fieldErrors,
    setFormData,
    handleInputChange,
    validateForm,
    prepareSubmitData,
    isValidUrl,
    isFormValid,
  }
}