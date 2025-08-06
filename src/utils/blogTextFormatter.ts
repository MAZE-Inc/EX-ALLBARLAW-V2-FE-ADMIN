/**
 * 블로그 텍스트에서 특정 헤더와 불릿 포인트를 제거하는 함수
 * @param {string} inputText - 정리할 원본 텍스트
 * @returns {string} - 정리된 텍스트
 */

export const getBlogSummaryText = (inputText: string): string => {
  if (!inputText) return ''

  let cleanedText = inputText.replace(/##\s+요약/g, '').replace(/##\s+변호사\s+선임의\s+필요성/g, '')
  cleanedText = cleanedText.replace(/\s-\s/g, ' ')
  cleanedText = cleanedText.replace(/\s+/g, ' ').trim()

  return cleanedText
}

/**
 * 한 줄로 된 블로그 텍스트를 요약 부분과 변호사 선임 부분으로 분리하는 함수
 * 요약 부분에서는 첫 번째 불릿(-) 포인트만 유지하고, 두번째 불릿부터 개행 처리
 * @param {string} inputText - 정리할 원본 텍스트
 * @returns {{ summary: string, lawyerPart: string[] }} - 분리된 텍스트
 */
export const getBlogDetailText = (inputText: string): { summary: string; lawyerPart: string[] } => {
  if (!inputText) return { summary: '', lawyerPart: [] }

  const summaryHeaderIndex = inputText.indexOf('## 요약')
  const lawyerHeaderIndex = inputText.indexOf('## 변호사 선임의 필요성')

  if (summaryHeaderIndex === -1 || lawyerHeaderIndex === -1) {
    console.log('헤더를 찾을 수 없습니다.')
    return { summary: inputText, lawyerPart: [] }
  }

  const summaryStartIndex = summaryHeaderIndex + '## 요약'.length
  const summaryText = inputText.substring(summaryStartIndex, lawyerHeaderIndex).trim()

  const lawyerStartIndex = lawyerHeaderIndex + '## 변호사 선임의 필요성'.length
  const lawyerText = inputText.substring(lawyerStartIndex).trim()

  // 요약 부분 처리
  // 모든 불릿 포인트 위치 찾기
  const bulletPositions = []
  let pos = summaryText.indexOf(' - ')
  while (pos !== -1) {
    bulletPositions.push(pos)
    pos = summaryText.indexOf(' - ', pos + 1)
  }

  let summaryClean = ''
  if (bulletPositions.length >= 2) {
    // 첫 번째 불릿 포인트의 내용 가져오기
    const firstBulletContent = summaryText.substring(bulletPositions[0] + 3, bulletPositions[1]).trim()

    // 두 번째 불릿 포인트부터는 개행으로 변환
    let remainingText = summaryText.substring(bulletPositions[1])
    remainingText = remainingText.replace(/ - /g, '\n')

    // 첫 번째 불릿 내용 + 나머지 개행 처리된 내용
    summaryClean = firstBulletContent + remainingText
  } else {
    // 불릿 포인트가 1개 이하인 경우 (예외 처리)
    summaryClean = summaryText.replace(/^\s*-\s+/, '')
  }

  // 변호사 부분을 불릿 포인트로 분리하여 배열로 만들기
  const lawyerItems = lawyerText
    .split(/\s*-\s+/)
    .filter(item => item.trim() !== '')
    .map(item => item.trim())

  return {
    summary: summaryClean.trim(),
    lawyerPart: lawyerItems,
  }
}
