/**
 * 주어진 시간(time)과 현재 시간 사이의 경과 시간을 밀리초 단위로 계산합니다.
 *
 * @param time - 경과 시간을 계산할 기준 시간.
 *   Date 객체, 타임스탬프(숫자), 또는 new Date()가 해석할 수 있는 날짜/시간 문자열.
 * @returns 경과 시간 (밀리초 단위). time 형식이 유효하지 않으면 null을 반환합니다.
 */
export const calculateTimeDifference = (time: string | number | Date): number | null => {
  const nowTimestamp = Date.now()
  const pastTimestamp = new Date(time).getTime()

  // 입력된 time이 유효한 날짜/시간인지 확인
  if (isNaN(pastTimestamp)) {
    console.error(`'${time}'은(는) 유효한 날짜/시간 형식이 아닙니다.`)
    return null // 유효하지 않으면 null 반환
  }

  const differenceInMillis = nowTimestamp - pastTimestamp
  return differenceInMillis
}

/**
 * 주어진 시간(time)과 현재 시간 사이의 경과 시간을 "N일 전", "N시간 전", "N분 전", "방금 전" 등으로 포맷팅합니다.
 *
 * @param time - 경과 시간을 계산할 기준 시간.
 * @returns 포맷팅된 시간 문자열 (예: "5분 전"). time 형식이 유효하지 않으면 빈 문자열을 반환합니다.
 */
export const formatTimeAgo = (time: string | number | Date): string => {
  const differenceInMillis = calculateTimeDifference(time)

  if (differenceInMillis === null) {
    return '' // 유효하지 않은 입력 처리
  }

  const seconds = Math.floor(differenceInMillis / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days}일 전`
  } else if (hours > 0) {
    return `${hours}시간 전`
  } else if (minutes > 0) {
    return `${minutes}분 전`
  } else {
    // return `${seconds}초 전`; // 초 단위 표시를 원하면 이 줄 사용
    return '방금 전' // 1분 미만은 "방금 전"으로 통일
  }
}

export const getRelativeTimeString = (date: Date | string): string => {
  const now = new Date()
  const targetDate = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return '방금 전'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}시간 전`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays}일 전`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths}개월 전`
  }

  const diffInYears = Math.floor(diffInMonths / 12)
  return `${diffInYears}년 전`
}
