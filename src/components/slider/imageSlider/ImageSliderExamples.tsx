import React, { useState } from 'react'
import ImageSlider, { ImageItem } from './ImageSlider'
import { Settings } from 'react-slick'

// 간단한 이미지 URL 배열
const simpleImages: string[] = [
  'https://picsum.photos/800/400?random=1',
  'https://picsum.photos/800/400?random=2',
  'https://picsum.photos/800/400?random=3',
  'https://picsum.photos/800/400?random=4',
]

// 예제 이미지 데이터 (기존 방식)
const detailedImages: ImageItem[] = [
  {
    id: 1,
    src: 'https://picsum.photos/800/400?random=5',
    alt: '이미지 1',
    title: '아름다운 풍경',
    description: '자연의 아름다움을 담은 풍경 사진입니다.',
    onClick: () => console.log('이미지 1 클릭됨'),
  },
  {
    id: 2,
    src: 'https://picsum.photos/800/400?random=6',
    alt: '이미지 2',
    title: '도시 야경',
    description: '화려한 도시의 밤 풍경입니다.',
    onClick: () => console.log('이미지 2 클릭됨'),
  },
  {
    id: 3,
    src: 'https://picsum.photos/800/400?random=7',
    alt: '이미지 3',
    title: '바다와 해변',
    description: '푸른 바다와 하얀 모래사장의 조화입니다.',
    onClick: () => console.log('이미지 3 클릭됨'),
  },
  {
    id: 4,
    src: 'https://picsum.photos/800/400?random=8',
    alt: '이미지 4',
    title: '산과 숲',
    description: '울창한 숲과 높은 산의 경치입니다.',
    onClick: () => console.log('이미지 4 클릭됨'),
  },
]

// 커스텀 화살표 컴포넌트들을 함수 밖으로 이동
const CustomPrevArrow = (props: any) => (
  <button
    {...props}
    style={{
      ...props.style,
      display: 'block',
      background: '#ff6b6b',
      borderRadius: '50%',
      border: 'none',
      width: '50px',
      height: '50px',
      left: '10px',
      zIndex: 2,
    }}
  >
    ←
  </button>
)

const CustomNextArrow = (props: any) => (
  <button
    {...props}
    style={{
      ...props.style,
      display: 'block',
      background: '#51cf66',
      borderRadius: '50%',
      border: 'none',
      width: '50px',
      height: '50px',
      right: '10px',
      zIndex: 2,
    }}
  >
    →
  </button>
)

const ImageSliderExamples: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  // 다양한 슬라이더 설정
  const autoplaySettings: Partial<Settings> = {
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
  }

  const fadeSettings: Partial<Settings> = {
    fade: true,
    cssEase: 'linear',
  }

  const multipleSlideSettings: Partial<Settings> = {
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>ImageSlider 사용 예제</h1>

      {/* 🔥 새로 추가: 간단한 문자열 배열 사용 */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>🔥 1. 간단한 사용법 (문자열 배열)</h2>
        <p>가장 간단하게 이미지 URL 배열만 넘기기</p>
        <ImageSlider images={simpleImages} width='100%' height={300} />
      </section>

      {/* 간단한 사용법 + 클릭 핸들러 */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>2. 문자열 배열 + 클릭 이벤트</h2>
        <ImageSlider
          images={simpleImages}
          width='100%'
          height={300}
          onImageClick={(src, index) => alert(`${index + 1}번째 이미지 클릭! URL: ${src}`)}
        />
      </section>

      {/* 기본 슬라이더 (객체 배열) */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>3. 상세 정보가 있는 슬라이더 (객체 배열)</h2>
        <ImageSlider images={detailedImages} width='100%' height={400} showTitle showDescription />
      </section>

      {/* 자동 재생 슬라이더 */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>4. 자동 재생 슬라이더</h2>
        <ImageSlider
          images={simpleImages}
          width='100%'
          height={300}
          sliderSettings={autoplaySettings}
          className='custom-slider-class'
        />
      </section>

      {/* 페이드 효과 슬라이더 */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>5. 페이드 효과 슬라이더</h2>
        <ImageSlider
          images={simpleImages}
          width='100%'
          height={350}
          sliderSettings={fadeSettings}
          imageObjectFit='contain'
          onSlideChange={slide => setCurrentSlide(slide)}
        />
        <p>현재 슬라이드: {currentSlide + 1}</p>
      </section>

      {/* 다중 슬라이드 */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>6. 다중 슬라이드</h2>
        <ImageSlider images={simpleImages} width='100%' height={250} sliderSettings={multipleSlideSettings} />
      </section>

      {/* 커스텀 화살표 */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>7. 커스텀 화살표</h2>
        <ImageSlider
          images={detailedImages}
          width='100%'
          height={300}
          customArrows={{
            prevArrow: CustomPrevArrow,
            nextArrow: CustomNextArrow,
          }}
          showTitle
        />
      </section>

      {/* 고정 크기 슬라이더 */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>8. 고정 크기 슬라이더</h2>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <ImageSlider images={simpleImages.slice(0, 2)} width={300} height={200} />
          <ImageSlider images={simpleImages.slice(2, 4)} width={300} height={200} className='theme-rounded' />
        </div>
      </section>

      {/* 커스텀 렌더링 */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>9. 커스텀 렌더링</h2>
        <ImageSlider
          images={simpleImages}
          width='100%'
          height={400}
          renderCustomContent={(item, index) => (
            <div style={{ position: 'relative', height: '100%' }}>
              <img
                src={item.src}
                alt={item.alt}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'sepia(50%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(255, 255, 255, 0.9)',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                }}
              >
                {index + 1} / {simpleImages.length}
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: '1rem',
                  left: '1rem',
                  background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                  color: 'white',
                  padding: '1rem',
                  borderRadius: '8px',
                  maxWidth: '70%',
                }}
              >
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>커스텀 슬라이드 #{index + 1}</h3>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>커스텀 렌더링으로 만든 특별한 슬라이드입니다.</p>
              </div>
            </div>
          )}
        />
      </section>

      {/* 미니멀 테마 */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>10. 미니멀 테마</h2>
        <ImageSlider
          images={simpleImages}
          width='100%'
          height={300}
          className='theme-minimal'
          sliderSettings={{ arrows: false }}
        />
      </section>
    </div>
  )
}

export default ImageSliderExamples
