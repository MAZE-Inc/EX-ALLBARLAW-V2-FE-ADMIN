// import styles from './multiple-image-slider.module.scss'

import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import styles from './multiple-image-slider.module.scss'

import { CSSProperties, useEffect, useRef } from 'react'

type MultipleImageSliderProps = {
  imageList: string[]
  imgHeight?: number
  dots?: boolean
  arrow?: boolean
  width?: number | string // 슬라이더 너비 prop 추가
}

interface CustomArrowProps {
  className?: string
  style?: CSSProperties
  onClick?: () => void
  type?: 'next' | 'prev'
}

const Arrow = ({ className, onClick, type }: CustomArrowProps) => (
  <div
    className={`${className} ${styles['nav-button']} ${styles[`nav-button-${type}`]}`}
    onClick={onClick}
    style={{ display: 'block', zIndex: 1 }}
  >
    {/* <SvgIcon name='slickArrow' size={16} style={{ transform: type === 'prev' ? 'rotate(180deg)' : 'rotate(0deg)' }} /> */}
  </div>
)

const MultipleImageSlider = ({
  imageList,
  imgHeight = 108,
  dots = false,
  arrow = true,
  width = '100%',
}: MultipleImageSliderProps) => {
  // 이미지 개수에 따른 설정 조정
  const hasMultipleImages = imageList.length > 1
  const sliderRef = useRef<Slider>(null)

  // 화면에 다 들어갈지 확인
  const containerWidth = typeof width === 'number' ? width : 800
  const estimatedImageWidth = 150 // 대략적인 이미지 너비
  const estimatedTotalWidth = imageList.length * estimatedImageWidth
  const needsScrolling = estimatedTotalWidth > containerWidth

  // 슬라이더 설정 - 스크롤이 필요할 때만 infinite
  const settings = {
    className: hasMultipleImages ? 'slider variable-width' : 'slider fixed-width',
    variableWidth: hasMultipleImages,
    dots: dots,
    infinite: hasMultipleImages && needsScrolling,
    centerMode: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: arrow && hasMultipleImages && needsScrolling,
    nextArrow: <Arrow type='next' />,
    prevArrow: <Arrow type='prev' />,
    swipeToSlide: hasMultipleImages,
    adaptiveHeight: false,
  }

  // 슬라이더 스타일
  const sliderStyle: CSSProperties = {
    width: width,
  }

  // 동적으로 CSS 변수 설정
  useEffect(() => {
    document.documentElement.style.setProperty('--slide-height', `${imgHeight}px`)
  }, [imgHeight])

  return (
    <div className={styles.sliderWrapper} style={sliderStyle}>
      {/* @ts-ignore - react-slick type compatibility issue */}
      <Slider ref={sliderRef} {...settings}>
        {imageList.map((img, index) => (
          <div key={index} className={styles.slideItem} style={{ height: `${imgHeight}px` }}>
            <figure style={{ height: `${imgHeight}px` }}>
              <img src={img} alt='lawfirm' className={styles['img-item']} style={{ height: `${imgHeight}px` }} />
            </figure>
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default MultipleImageSlider
