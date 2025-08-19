/**
 * 임시 저장소 유틸리티
 * sessionStorage에 만료 시간 기능을 추가한 래퍼
 */

interface TemporaryItem {
  value: string
  expiry: number
}

/**
 * 만료 시간이 있는 아이템 저장
 * @param key 저장할 키
 * @param value 저장할 값
 * @param minutes 만료 시간 (분 단위, 기본값: 30분)
 */
export const setTemporaryItem = (key: string, value: string, minutes: number = 30): void => {
  const expiryTime = Date.now() + minutes * 60 * 1000
  const item: TemporaryItem = {
    value,
    expiry: expiryTime,
  }
  sessionStorage.setItem(key, JSON.stringify(item))
}

/**
 * 만료 시간을 체크하여 아이템 가져오기
 * @param key 가져올 키
 * @returns 유효한 값 또는 null (만료/없음)
 */
export const getTemporaryItem = (key: string): string | null => {
  const itemStr = sessionStorage.getItem(key)

  // 기존 방식으로 저장된 값 처리 (마이그레이션 호환성)
  if (itemStr && !itemStr.startsWith('{')) {
    // 단순 문자열이면 그대로 반환 (기존 코드 호환)
    return itemStr
  }

  if (!itemStr) return null

  try {
    const item: TemporaryItem = JSON.parse(itemStr)

    // 만료 시간 체크
    if (Date.now() > item.expiry) {
      sessionStorage.removeItem(key)
      return null
    }

    return item.value
  } catch {
    // 파싱 실패 시 기존 값 그대로 반환
    return itemStr
  }
}

/**
 * 아이템 제거
 * @param key 제거할 키
 */
export const removeTemporaryItem = (key: string): void => {
  sessionStorage.removeItem(key)
}

/**
 * 아이템이 존재하고 유효한지 확인
 * @param key 확인할 키
 * @returns 유효 여부
 */
export const hasTemporaryItem = (key: string): boolean => {
  return getTemporaryItem(key) !== null
}
