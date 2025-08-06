import VideoItem from '@/components/videoItem/VideoItem'
import { useInfiniteVideoList } from '@/hooks/queries/useContent'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './videoList.module.scss'
import { Divider } from 'antd'
import { ROUTE_PATH } from '@/routes/routePath'

const VideoList = () => {
  const { subCategoryId } = useParams()
  const navigate = useNavigate()

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteVideoList({
    subcategoryId: subCategoryId ? Number(subCategoryId) : 'all',
  })

  useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    containerSelector: '.video-list-container',
  })

  const handleClickVideo = (videoCaseId: number) => {
    navigate(`${ROUTE_PATH.CONTENT}/${ROUTE_PATH.CONTENT_VIDEO}/${subCategoryId}/${videoCaseId}`)
  }

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
                onClick={() => handleClickVideo(video.videoCaseId)}
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
