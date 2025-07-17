export const errorHandle = (errorCode: number) => {
  switch (errorCode) {
    case 4901:
      return '입력값이 올바르지 않습니다. 다시 확인해주세요'
    case 4903:
      return '이미 존재하는 값입니다. 다른 값으로 입력해주세요'
    default:
      return '알 수 없는 오류가 발생했습니다, 다시 시도해주세요'
  }
}
