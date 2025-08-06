import React, { useState, useEffect } from 'react'
import YouTube, { YouTubeProps } from 'react-youtube'
import styles from './youtube-player.module.scss'
import { extractYouTubeVideoId } from '@/utils/youtubeUtils'

type YoutubePlayerProps = {
  videoId?: string
  url?: string
  width?: string | number
  autoplay?: boolean
  controls?: boolean
  className?: string
  onReady?: () => void
  onPlay?: () => void
  onPause?: () => void
  onEnd?: () => void
}

const YoutubePlayer = ({
  videoId,
  url,
  width,
  autoplay = false,
  controls = true,
  className,
  onReady,
  onPlay,
  onPause,
  onEnd,
}: YoutubePlayerProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [parsedVideoId, setParsedVideoId] = useState<string | null>(null)

  // URL에서 videoId 파싱 또는 직접 전달받은 videoId 사용
  useEffect(() => {
    if (url) {
      const extracted = extractYouTubeVideoId(url)
      if (extracted) {
        setParsedVideoId(extracted)
        setError(null)
      } else {
        setError('유효하지 않은 YouTube URL입니다.')
        setIsLoading(false)
      }
    } else if (videoId) {
      setParsedVideoId(videoId)
      setError(null)
    } else {
      setError('YouTube URL 또는 Video ID가 필요합니다.')
      setIsLoading(false)
    }
  }, [url, videoId])

  const opts: YouTubeProps['opts'] = {
    width: '100%',
    height: '100%',
    playerVars: {
      autoplay: autoplay ? 1 : 0,
      controls: controls ? 1 : 0,
      rel: 0, // 관련 동영상 표시 안함
      modestbranding: 1, // YouTube 로고 최소화
      iv_load_policy: 3, // 주석 표시 안함
    },
  }

  // 컨테이너 스타일 - width가 지정되면 해당 값 사용, 아니면 기본 CSS 사용
  const containerStyle: React.CSSProperties = width ? { width, minWidth: width, maxWidth: width } : {}

  const handleReady = () => {
    setIsLoading(false)
    onReady?.()
  }

  const handlePlay = () => {
    onPlay?.()
  }

  const handlePause = () => {
    onPause?.()
  }

  const handleEnd = () => {
    onEnd?.()
  }

  const handleError = () => {
    setError('동영상을 불러올 수 없습니다.')
    setIsLoading(false)
  }

  if (error) {
    return (
      <div className={`${styles['youtube-error']} ${className}`} style={containerStyle}>
        <p>{error}</p>
      </div>
    )
  }

  if (!parsedVideoId) {
    return (
      <div className={`${styles['youtube-loading']} ${className}`} style={containerStyle}>
        <div className={styles['loading-spinner']}></div>
        <p>동영상 정보를 처리하는 중...</p>
      </div>
    )
  }

  return (
    <div className={`${styles['youtube-player-wrapper']} ${className}`} style={containerStyle}>
      {isLoading && (
        <div className={styles['youtube-loading']}>
          <div className={styles['loading-spinner']}></div>
          <p>동영상을 불러오는 중...</p>
        </div>
      )}
      <YouTube
        videoId={parsedVideoId}
        opts={opts}
        onReady={handleReady}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnd={handleEnd}
        onError={handleError}
        className={styles['youtube-player']}
      />
    </div>
  )
}

export default YoutubePlayer
