import VideoItem from '@/components/videoItem/VideoItem'
import { useInfiniteVideoList } from '@/hooks/queries/useContent'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import styles from './videoList.module.scss'
import { Divider } from 'antd'

interface VideoListProps {
  subCategoryId: number | null
}

const VideoList = ({ subCategoryId = null }: VideoListProps) => {
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteVideoList({
    subcategoryId: subCategoryId ?? 'all',
  })

  useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    containerSelector: '.video-list-container',
  })

  return (
    <main className={styles['video-list']}>
      <section className={`${styles['video-list-container']} video-list-container`}>
        {data?.pages.map(page =>
          page.data.map(video => (
            <>
              <VideoItem
                key={video.videoCaseId}
                title={video.title}
                thumbnailUrl={video.thumbnail}
                lawyerName={video.lawyerName}
                lawfirmName={video.lawfirmName}
                channelName={video.channelName}
                channelThumbnail={video.channelThumbnail}
                summaryContents={video.summaryContent}
              />
              <Divider />
            </>
          ))
        )}
      </section>
    </main>
  )
}

export default VideoList
