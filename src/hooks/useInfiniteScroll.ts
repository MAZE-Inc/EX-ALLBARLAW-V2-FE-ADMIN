import { useCallback, useEffect } from 'react'

interface UseInfiniteScrollProps {
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  fetchNextPage: () => void
  containerSelector?: string
}

export const useInfiniteScroll = ({
  hasNextPage = false,
  isFetchingNextPage = false,
  fetchNextPage,
  containerSelector = '.lawyer-selection-container',
}: UseInfiniteScrollProps) => {
  const handleScroll = useCallback(() => {
    const scrollContainer = document.querySelector(containerSelector) as HTMLElement
    if (!scrollContainer) return

    const { scrollTop, scrollHeight, clientHeight } = scrollContainer

    // 스크롤이 끝에서 100px 이내에 도달했을 때 다음 페이지 로드
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100

    if (isNearBottom && hasNextPage && !isFetchingNextPage) {
      console.log('🟢 useInfiniteScroll - 다음 페이지 로드 시작')
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, containerSelector])

  // 스크롤 이벤트 리스너 등록
  useEffect(() => {
    const scrollContainer = document.querySelector(containerSelector)
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll)
      return () => scrollContainer.removeEventListener('scroll', handleScroll)
    }
    return undefined
  }, [handleScroll, containerSelector])

  // 초기 로드 및 데이터 변경 시 스크롤 체크
  useEffect(() => {
    // hasNextPage가 true일 때만 체크
    if (hasNextPage && !isFetchingNextPage) {
      // DOM 업데이트를 기다린 후 체크
      const timeoutId = setTimeout(() => {
        const scrollContainer = document.querySelector(containerSelector) as HTMLElement
        if (!scrollContainer) return

        const hasScroll = scrollContainer.scrollHeight > scrollContainer.clientHeight

        // 스크롤이 없고, 다음 페이지가 있고, 로딩중이 아니면 추가 로드
        if (!hasScroll && hasNextPage && !isFetchingNextPage) {
          console.log('📚 스크롤이 없어서 추가 데이터 로드')
          fetchNextPage()
        }
      }, 100)
      return () => clearTimeout(timeoutId)
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, containerSelector])

  return { handleScroll }
}
