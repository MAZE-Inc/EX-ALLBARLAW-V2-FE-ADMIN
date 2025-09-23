import { useState } from 'react'
import { message } from 'antd'
import { useGetVideoChannelInfo } from '@/hooks/queries/useContent'
import { GetVideoChannelInfoResponse } from '@/types/videoTypes'

interface ChannelInfoData {
  channelName: string
  handleName: string
  channelDescription: string
  channelThumbnail: string
  subscriberCount: number
}

export const useChannelInfo = () => {
  const [isChannelInfoFetched, setIsChannelInfoFetched] = useState(false)
  const [subscriberCount, setSubscriberCount] = useState(0)
  const [channelData, setChannelData] = useState<ChannelInfoData | null>(null)

  const { mutate: fetchChannelInfo, isPending: isChannelLoading } = useGetVideoChannelInfo({
    onSuccess: (data: GetVideoChannelInfoResponse) => {
      const formattedData: ChannelInfoData = {
        channelName: data.channelName,
        handleName: data.handleName,
        channelDescription: data.channelDescription,
        channelThumbnail: data.channelThumbnail,
        subscriberCount: data.subscriberCount,
      }
      setChannelData(formattedData)
      setSubscriberCount(data.subscriberCount)
      setIsChannelInfoFetched(true)
    },
    onError: () => {
      message.error('채널 정보 불러오기에 실패했습니다. 다시 시도해주세요.')
    },
  })

  const handleFetchChannelInfo = (url: string) => {
    if (!url) {
      message.warning('유튜브 채널 정보를 입력해주세요.')
      return
    }
    fetchChannelInfo({ channelUrl: url })
  }

  return {
    isChannelInfoFetched,
    subscriberCount,
    channelData,
    isChannelLoading,
    handleFetchChannelInfo,
  }
}
