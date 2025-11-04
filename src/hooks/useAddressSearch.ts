export interface AddressData {
  address: string
  zonecode: string
}

declare global {
  interface Window {
    daum?: any
  }
}

const loadDaumPostcodeScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.daum && window.daum.Postcode) {
      resolve()
      return
    }
    const existing = document.querySelector("script[data-daum-postcode='true']") as HTMLScriptElement | null
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('Daum Postcode script load failed')))
      return
    }
    const script = document.createElement('script')
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
    script.async = true
    script.setAttribute('data-daum-postcode', 'true')
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Daum Postcode script load failed'))
    document.head.appendChild(script)
  })
}

export const useAddressSearch = () => {
  const open = async (onComplete: (data: AddressData) => void) => {
    try {
      await loadDaumPostcodeScript()

      if (!window.daum?.Postcode) {
        console.error('Daum Postcode API를 불러올 수 없습니다.')
        return
      }

      new window.daum.Postcode({
        oncomplete: (data: any) => {
          const address: string = data.roadAddress || data.jibunAddress || ''
          const zonecode: string = data.zonecode || ''
          onComplete({ address, zonecode })
        },
      }).open()
    } catch (error) {
      console.error('주소 검색 모듈 로드 실패:', error)
    }
  }

  return { open }
}
