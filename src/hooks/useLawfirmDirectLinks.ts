import { useState, useCallback } from 'react'
import { message } from 'antd'

interface DirectLink {
  id: number
  name: string
  link: string
}

interface DirectLinkForSubmit {
  name: string
  link: string
}

export const useLawfirmDirectLinks = (initialLinks?: DirectLink[]) => {
  const [localDirects, setLocalDirects] = useState<DirectLink[]>(initialLinks || [])
  const [urlErrors, setUrlErrors] = useState<{ [key: number]: string }>({})

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

  // 링크 추가
  const handleAddLink = useCallback(() => {
    const newLink = {
      id: Date.now(),
      name: '',
      link: '',
    }
    setLocalDirects(prev => [...prev, newLink])
    return newLink
  }, [])

  // 링크 제거
  const handleRemoveLink = useCallback((id: number) => {
    setLocalDirects(prev => prev.filter(d => d.id !== id))
    setUrlErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[id]
      return newErrors
    })
  }, [])

  // 링크 변경
  const handleLinkChange = useCallback((id: number, field: 'name' | 'link', value: string) => {
    // link 필드일 때 URL 유효성 검증
    if (field === 'link') {
      if (value.trim()) {
        const hasProtocol = value.startsWith('http://') || value.startsWith('https://')
        const isRelativePath = value.startsWith('/')
        const seemsComplete = hasProtocol ? value.replace(/^https?:\/\//, '').includes('.') : false

        if ((hasProtocol && seemsComplete) || isRelativePath) {
          if (!isValidUrl(value)) {
            setUrlErrors(prev => ({
              ...prev,
              [id]: '유효한 URL 형식을 입력해주세요. (http://example.com, https://example.com 또는 /path)',
            }))
          } else {
            setUrlErrors(prev => {
              const newErrors = { ...prev }
              delete newErrors[id]
              return newErrors
            })
          }
        } else if (hasProtocol && !seemsComplete) {
          // http:// 또는 https:// 로 시작하지만 아직 도메인을 입력 중
          setUrlErrors(prev => {
            const newErrors = { ...prev }
            delete newErrors[id]
            return newErrors
          })
        } else if (!hasProtocol && !isRelativePath) {
          // 프로토콜이 없고 상대경로도 아닌 경우
          setUrlErrors(prev => ({
            ...prev,
            [id]: 'URL은 http://, https:// 또는 / 로 시작해야 합니다.',
          }))
        }
      } else {
        // 빈 값인 경우 에러 제거
        setUrlErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors[id]
          return newErrors
        })
      }
    }

    setLocalDirects(prev =>
      prev.map(d => (d.id === id ? { ...d, [field]: value } : d))
    )
  }, [])

  // API 제출용 형식으로 변환
  const getDirectsForSubmit = useCallback((): DirectLinkForSubmit[] => {
    return localDirects.map(link => ({
      name: link.name,
      link: link.link,
    }))
  }, [localDirects])

  // 유효성 검증
  const validateDirectLinks = useCallback(() => {
    // URL 에러가 있는지 확인
    if (Object.keys(urlErrors).length > 0) {
      message.warning('유효하지 않은 URL이 있습니다. 확인 후 다시 시도해주세요.')
      return false
    }

    // 이름과 링크가 쌍으로 입력되었는지 확인
    const hasIncompleteDirect = localDirects.some(direct => {
      return (direct.name && !direct.link) || (!direct.name && direct.link)
    })

    if (hasIncompleteDirect) {
      message.error('바로가기 링크의 이름과 URL을 모두 입력해주세요.')
      return false
    }

    return true
  }, [localDirects, urlErrors])

  // 초기 링크 설정
  const initializeLinks = useCallback((links: DirectLink[]) => {
    setLocalDirects(links)
  }, [])

  return {
    localDirects,
    urlErrors,
    handleAddLink,
    handleRemoveLink,
    handleLinkChange,
    getDirectsForSubmit,
    validateDirectLinks,
    initializeLinks,
  }
}