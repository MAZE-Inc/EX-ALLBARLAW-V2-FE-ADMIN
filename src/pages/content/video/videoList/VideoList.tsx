import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import VideoItem from '@/components/videoItem/VideoItem'
import { useInfiniteVideoList } from '@/hooks/queries/useContent'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import styles from './videoList.module.scss'
import { Button, Divider } from 'antd'
import { ROUTE_PATH } from '@/routes/routePath'
import { VIDEO_HEADER_PORTAL_ID } from '../videoMain/VideoPage'
import EmptyState from '@/components/emptyState/EmptyState'

const VideoList = () => {
  const { subCategoryId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const search = searchParams.get('search') || undefined
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const container = document.getElementById(VIDEO_HEADER_PORTAL_ID)
    setPortalContainer(container)
  }, [])

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteVideoList({
    subcategoryId: subCategoryId ? Number(subCategoryId) : 'all',
    search,
  })

  useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    containerSelector: '.video-list-container',
  })

  const handleClickVideo = (videoCaseId: number) => {
    navigate(`${ROUTE_PATH.CONTENT_VIDEO}/${subCategoryId}/${videoCaseId}`)
  }

  const handleRegisterVideo = () => {
    if (subCategoryId) {
      navigate(`${subCategoryId}/edit`)
    } else {
      navigate('edit')
    }
  }

  const isEmpty = !data?.pages || data.pages.every(page => page.data.length === 0)

  if (isEmpty && !isFetchingNextPage) {
    return (
      <main className={styles['video-list']} style={{ display: 'flex', flex: 1 }}>
        <section
          className={styles['video-list-container']}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}
        >
          <EmptyState
            icon={search ? '🔍' : '🎬'}
            message={search ? `'${search}' 검색 결과가 없습니다` : '영상 컨텐츠가 없습니다'}
          />
        </section>
      </main>
    )
  }

  return (
    <>
      {portalContainer &&
        createPortal(
          <Button type='primary' onClick={handleRegisterVideo}>
            영상정보 글 등록
          </Button>,
          portalContainer
        )}
      <main className={styles['video-list']}>
        <section className={`${styles['video-list-container']} video-list-container`}>
          {data?.pages.map(page =>
            page.data.map(video => (
              <div key={video.videoCaseId}>
                <VideoItem
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
              </div>
            ))
          )}
        </section>
      </main>
    </>
  )
}

export default VideoList
