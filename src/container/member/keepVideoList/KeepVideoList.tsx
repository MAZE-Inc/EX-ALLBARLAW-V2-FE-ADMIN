import React from 'react'
import VideoItem from '@/components/videoItem/VideoItem'
import styles from './keepVideoList.module.scss'
import { Divider } from 'antd'
import EmptyState from '@/components/emptyState/EmptyState'
import { useInfiniteMemberKeepVideoList } from '@/hooks/queries/useMember'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { useNavigate } from 'react-router-dom'

const KeepVideoList = ({ userId, sort }: { userId: number; sort: 'asc' | 'desc' }) => {
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteMemberKeepVideoList(userId, sort)
  const navigate = useNavigate()

  useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    containerSelector: '.keep-video-list-container',
  })

  // 빈 상태 체크
  const isEmpty = !data?.pages || data.pages.every(page => !page?.data || page.data.length === 0)

  if (isEmpty && !isFetchingNextPage) {
    return (
      <div className={styles.keepVideoList}>
        <EmptyState icon='🎥' message='Keep한 비디오가 없습니다' />
      </div>
    )
  }

  const handleClickVideo = (videoCaseId: number) => {
    navigate(`/content/content-video/all/${videoCaseId}`)
  }

  return (
    <div className={`${styles.keepVideoList} keep-video-list-container`}>
      {data?.pages.map(page =>
        page?.data?.map((item, index) => (
          <React.Fragment key={item.videoCaseId}>
            <VideoItem
              onClick={() => handleClickVideo(item.videoCaseId)}
              thumbnailUrl={item.thumbnail}
              title={item.title}
              lawyerName={item.lawyerName}
              lawfirmName={item.lawfirmName}
              channelName={item.channelName}
              channelThumbnail={item.channelThumbnail}
              summaryContents={item.summaryContent}
            />
            {index !== page.data.length - 1 && <Divider />}
          </React.Fragment>
        ))
      )}
    </div>
  )
}

export default KeepVideoList
