import { useState } from 'react'
import { message } from 'antd'
import { useVideoAiSummary } from '@/hooks/queries/useAiSummary'

export const useVideoAiSummaryLogic = () => {
  const [shouldFetchSummary, setShouldFetchSummary] = useState(false)
  const [summaryUrl, setSummaryUrl] = useState('')

  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    refetch: refetchSummary
  } = useVideoAiSummary(
    { url: summaryUrl },
    {
      enabled: false // 수동으로 refetch할 것이므로 기본적으로 비활성화
    }
  )

  const handleAiSummary = async (url: string) => {
    if (!url) {
      message.warning('먼저 유튜브 URL을 입력해주세요.')
      return
    }

    setShouldFetchSummary(true)
    setSummaryUrl(url)

    // URL이 설정된 후 refetch 실행
    setTimeout(() => {
      refetchSummary()
    }, 100)
  }

  const resetSummaryFlag = () => {
    setShouldFetchSummary(false)
  }

  return {
    summaryData,
    isSummaryLoading,
    shouldFetchSummary,
    handleAiSummary,
    resetSummaryFlag,
  }
}