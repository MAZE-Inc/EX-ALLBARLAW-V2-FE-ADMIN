import React from 'react'
import VideoItem from '@/components/videoItem/VideoItem'
import styles from './keepVideoList.module.scss'
import { Divider } from 'antd'
import EmptyState from '@/components/emptyState/EmptyState'
import { useMemberKeppVideoList } from '@/hooks/queries/useMember'

const KeepVideoList = ({ userId }: { userId: number }) => {
  const { data: videoList } = useMemberKeppVideoList(userId)

  if (videoList?.length === 0) {
    return (
      <div className={styles.keepVideoList}>
        <EmptyState icon='🎥' message='Keep한 비디오가 없습니다' />
      </div>
    )
  }

  return (
    <div className={styles.keepVideoList}>
      {videoList?.map((item, index) => (
        <React.Fragment key={item.videoCaseId}>
          <VideoItem
            thumbnailUrl={item.thumbnail}
            title={item.title}
            lawyerName={item.lawyerName}
            lawfirmName={item.lawfirmName}
            channelName={item.channelName}
            channelThumbnail={item.channelThumbnail}
            summaryContents={item.summaryContent}
          />
          {index !== videoList.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </div>
  )
}

export default KeepVideoList
