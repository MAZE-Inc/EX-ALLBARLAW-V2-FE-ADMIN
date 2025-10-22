/**
 * 전화번호를 포맷팅합니다.
 * @param phoneNumber 전화번호 (숫자만 또는 하이픈 포함)
 * @returns 포맷팅된 전화번호 (예: 010-1234-5678, 02-123-4567)
 */
export const formatPhoneNumber = (phoneNumber: string | null): string => {
  if (!phoneNumber) return ''

  // 숫자만 추출
  const numbers = phoneNumber.replace(/[^0-9]/g, '')

  // 길이별 포맷팅
  if (numbers.length === 11) {
    // 휴대폰: 010-1234-5678
    return numbers.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
  } else if (numbers.length === 10) {
    // 지역번호 2자리: 02-1234-5678
    if (numbers.startsWith('02')) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3')
    }
    // 지역번호 3자리: 031-123-4567
    return numbers.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
  } else if (numbers.length === 9) {
    // 서울 (02): 02-123-4567
    if (numbers.startsWith('02')) {
      return numbers.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3')
    }
  }

  // 포맷팅 불가능한 경우 원본 반환
  return phoneNumber
}
