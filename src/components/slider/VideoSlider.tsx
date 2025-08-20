import React, { useState, useRef, useEffect } from 'react'
import styles from './video-slider.module.scss'

export type VideoItem = {
  id: number
  title: string
  thumbnail: string
  channelName?: string
  onClick?: () => void
}

type VideoSliderProps = {
  title: string
  videos: VideoItem[]
  className?: string
  autoPlay?: boolean
  autoPlayInterval?: number // milliseconds, default: 3000
}

const VideoSlider = ({ title, videos, className, autoPlay = false, autoPlayInterval = 3000 }: VideoSliderProps) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [translateX, setTranslateX] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const sliderRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const totalSlides = videos.length

  // 자동 슬라이드 진행
  const goToNextSlide = () => {
    if (currentSlide === totalSlides - 1) {
      // 마지막 슬라이드에서 첫 번째로: 무한 루프 효과
      setIsTransitioning(true)
      setCurrentSlide(totalSlides) // 임시로 복제본 위치로

      setTimeout(() => {
        setIsTransitioning(false)
        setCurrentSlide(0) // transition 없이 첫 번째로 이동
        setTimeout(() => {
          setIsTransitioning(true) // transition 다시 활성화
        }, 50)
      }, 300) // transition 시간과 맞춤
    } else {
      setCurrentSlide(prev => prev + 1)
    }
  }

  // 자동 재생 타이머 설정
  useEffect(() => {
    if (autoPlay && !isPaused && !isDragging && totalSlides > 1) {
      autoPlayRef.current = setInterval(goToNextSlide, autoPlayInterval)
    } else {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
        autoPlayRef.current = null
      }
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [autoPlay, isPaused, isDragging, autoPlayInterval, totalSlides, currentSlide])

  const handleSlideChange = (index: number) => {
    if (index >= 0 && index < totalSlides) {
      setIsTransitioning(true)
      setCurrentSlide(index)
      setTranslateX(0)
    }
  }

  // 마우스/터치 이벤트 핸들러
  const handleStart = (clientX: number) => {
    setIsDragging(true)
    setStartX(clientX)
  }

  const handleMove = (clientX: number) => {
    if (!isDragging) return

    const diff = clientX - startX
    setTranslateX(diff)
  }

  const handleEnd = () => {
    if (!isDragging) return

    setIsDragging(false)

    // 50px 이상 움직였을 때만 슬라이드 변경
    if (Math.abs(translateX) > 50) {
      if (translateX > 0 && currentSlide > 0) {
        // 오른쪽으로 스와이프 - 이전 슬라이드
        handleSlideChange(currentSlide - 1)
      } else if (translateX < 0 && currentSlide < totalSlides - 1) {
        // 왼쪽으로 스와이프 - 다음 슬라이드
        handleSlideChange(currentSlide + 1)
      }
    }

    setTranslateX(0)
  }

  // 마우스 이벤트
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleStart(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX)
  }

  const handleMouseUp = () => {
    handleEnd()
  }

  // 터치 이벤트
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    handleEnd()
  }

  // 마우스 호버 시 자동 재생 일시정지
  const handleMouseEnter = () => {
    if (autoPlay) {
      setIsPaused(true)
    }
  }

  const handleMouseLeave = () => {
    if (autoPlay) {
      setIsPaused(false)
    }
  }

  // 전역 마우스 이벤트 리스너
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX)
      }
    }

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleEnd()
      }
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove)
      document.addEventListener('mouseup', handleGlobalMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [isDragging, startX, translateX, currentSlide])

  return (
    <div
      className={`${styles['video-slider-container']} ${className || ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles['slider-content']}>
        <h3 className={styles['slider-title']}>{title}</h3>

        <div
          className={styles['slider-wrapper']}
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className={styles['slider-track']}
            style={{
              transform: `translateX(calc(-${currentSlide * 100}% + ${translateX}px))`,
              transition: isDragging ? 'none' : isTransitioning ? 'transform 0.3s ease' : 'none',
            }}
          >
            {videos.map(video => (
              <div key={video.id} className={styles['slide-item']} onClick={video.onClick}>
                <div className={styles['video-thumbnail']}>
                  <img src={video.thumbnail} alt={video.title} />
                </div>
                <div className={styles['video-info']}>
                  <h4 className={styles['video-title']}>{video.title}</h4>
                </div>
              </div>
            ))}
            {/* 무한 루프를 위한 첫 번째 슬라이드 복제 */}
            {totalSlides > 1 && (
              <div className={styles['slide-item']} onClick={videos[0].onClick}>
                <div className={styles['video-thumbnail']}>
                  <img src={videos[0].thumbnail} alt={videos[0].title} />
                </div>
                <div className={styles['video-info']}>
                  <h4 className={styles['video-title']}>{videos[0].title}</h4>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 페이지네이션 - 카드 바깥으로 */}
      <div className={styles['pagination']} data-count={videos.length}>
        {videos.map((_, index) => (
          <button
            key={index}
            className={`${styles['pagination-dot']} ${index === currentSlide % totalSlides ? styles['active'] : ''}`}
            onClick={() => handleSlideChange(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default VideoSlider
