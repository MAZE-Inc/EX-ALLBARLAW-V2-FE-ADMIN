import { useState, useCallback } from 'react'

export interface ValidationErrors {
  [key: string]: string | undefined
}

export interface ValidationRules {
  [field: string]: (value: any, formData?: any) => string | undefined
}

interface UseFormValidationOptions {
  rules: ValidationRules
  isEditMode?: boolean
}

export const useFormValidation = ({ rules, isEditMode = false }: UseFormValidationOptions) => {
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())

  const validateField = useCallback(
    (field: string, value: any, formData?: any) => {
      if (rules[field]) {
        return rules[field](value, formData)
      }
      return undefined
    },
    [rules]
  )

  const validateAllFields = useCallback(
    (formData: any) => {
      const newErrors: ValidationErrors = {}
      let hasError = false

      Object.keys(rules).forEach(field => {
        const error = validateField(field, formData[field], formData)
        if (error) {
          newErrors[field] = error
          hasError = true
        }
      })

      setErrors(newErrors)
      return !hasError
    },
    [rules, validateField]
  )

  const handleFieldChange = useCallback(
    (field: string, value: any, formData?: any) => {
      if (touched.has(field)) {
        const error = validateField(field, value, formData)
        setErrors(prev => ({ ...prev, [field]: error }))
      }
    },
    [touched, validateField]
  )

  const handleFieldBlur = useCallback(
    (field: string, value: any, formData?: any) => {
      setTouched(prev => new Set(prev).add(field))
      const error = validateField(field, value, formData)
      setErrors(prev => ({ ...prev, [field]: error }))
    },
    [validateField]
  )

  const resetValidation = useCallback(() => {
    setErrors({})
    setTouched(new Set())
  }, [])

  const getFieldError = useCallback(
    (field: string) => {
      return errors[field] && touched.has(field) ? errors[field] : undefined
    },
    [errors, touched]
  )

  const hasFieldError = useCallback(
    (field: string) => {
      return !!(errors[field] && touched.has(field))
    },
    [errors, touched]
  )

  return {
    errors,
    touched,
    validateField,
    validateAllFields,
    handleFieldChange,
    handleFieldBlur,
    resetValidation,
    getFieldError,
    hasFieldError,
    setErrors,
    setTouched,
  }
}

// 공통 validation 규칙들
export const commonValidators = {
  email: (value: string) => {
    if (!value) return '이메일을 입력해주세요.'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) return '올바른 이메일 형식이 아닙니다.'
    return undefined
  },

  account: (value: string) => {
    if (!value) return '아이디를 입력해주세요.'
    if (value.length < 4) return '아이디는 4자 이상이어야 합니다.'
    if (value.length > 20) return '아이디는 20자 이하여야 합니다.'
    const accountRegex = /^[a-zA-Z0-9_]+$/
    if (!accountRegex.test(value)) return '아이디는 영문, 숫자, 언더스코어만 사용 가능합니다.'
    return undefined
  },

  name: (value: string) => {
    if (!value) return '이름을 입력해주세요.'
    if (value.length < 2) return '이름은 2자 이상이어야 합니다.'
    if (value.length > 50) return '이름은 50자 이하여야 합니다.'
    return undefined
  },

  password: (isEditMode: boolean = false) => (value: string) => {
    // 수정 모드에서는 비밀번호가 비어있어도 허용
    if (isEditMode && !value) return undefined
    if (!value) return '비밀번호를 입력해주세요.'
    if (value.length < 8) return '비밀번호는 8자 이상이어야 합니다.'
    if (value.length > 20) return '비밀번호는 20자 이하여야 합니다.'
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
    if (!passwordRegex.test(value)) {
      return '비밀번호는 대문자, 소문자, 숫자, 특수문자를 각각 하나 이상 포함해야 합니다.'
    }
    return undefined
  },

  passwordConfirm: (isEditMode: boolean = false) => (value: string, formData: any) => {
    // 수정 모드에서 비밀번호가 비어있으면 확인도 비어있어도 됨
    if (isEditMode && !formData?.password && !value) return undefined
    if (!value) return '비밀번호 확인을 입력해주세요.'
    if (value !== formData?.password) return '비밀번호가 일치하지 않습니다.'
    return undefined
  },

  required: (fieldName: string) => (value: any) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return `${fieldName}을(를) 입력해주세요.`
    }
    return undefined
  },

  minLength: (min: number, fieldName: string) => (value: string) => {
    if (value && value.length < min) {
      return `${fieldName}은(는) ${min}자 이상이어야 합니다.`
    }
    return undefined
  },

  maxLength: (max: number, fieldName: string) => (value: string) => {
    if (value && value.length > max) {
      return `${fieldName}은(는) ${max}자 이하여야 합니다.`
    }
    return undefined
  },

  pattern: (pattern: RegExp, message: string) => (value: string) => {
    if (value && !pattern.test(value)) {
      return message
    }
    return undefined
  },

  url: (value: string) => {
    if (!value) return undefined // URL은 선택적 필드

    // 상대 경로는 허용
    if (value.startsWith('/')) return undefined

    // http:// 또는 https:// 로 시작하는지 확인
    if (!value.startsWith('http://') && !value.startsWith('https://')) {
      return 'URL은 http://, https:// 또는 / 로 시작해야 합니다.'
    }

    try {
      const urlObj = new URL(value)
      // localhost는 거부
      if (urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1') {
        return 'localhost URL은 사용할 수 없습니다.'
      }
      return undefined
    } catch {
      return '올바른 URL 형식이 아닙니다.'
    }
  },

  phone: (value: string) => {
    if (!value) return '전화번호를 입력해주세요.'
    const phoneRegex = /^[0-9-]+$/
    if (!phoneRegex.test(value)) return '전화번호는 숫자와 하이픈(-)만 입력 가능합니다.'
    const digitsOnly = value.replace(/-/g, '')
    if (digitsOnly.length < 10 || digitsOnly.length > 11) {
      return '올바른 전화번호 형식이 아닙니다.'
    }
    return undefined
  },
}