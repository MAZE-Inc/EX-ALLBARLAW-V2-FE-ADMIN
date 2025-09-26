import styles from './vidoe-info.module.scss'

type VidoeInfoProps = {
  channelThumbnail: string
  channelName: string
  handleName: string
  subscriberCount: number
  channelDescription: string
  source: string
}

const VidoeInfo = ({
  channelThumbnail,
  channelName,
  handleName,
  subscriberCount,
  channelDescription,
  source,
}: VidoeInfoProps) => {
  const handleChannelButton = () => {
    window.open(source, '_blank')
  }

  // 구독자 수 안전하게 포맷팅
  const formatSubscriberCount = (count: number) => {
    const numCount = Number(count)
    if (isNaN(numCount) || numCount <= 0) {
      return '0'
    }
    return numCount.toLocaleString()
  }

  return (
    <section className={styles['container']}>
      <figure className={styles['channel-thumbnail']}>
        <img src={channelThumbnail} alt='유튜브채널썸네일' />
      </figure>
      <div className={styles['video-info']}>
        <header className={styles['info-header']}>
          <div>
            <h3 className={styles['channel-name']}>{channelName}</h3>
            <span>
              {handleName}
              <span style={{ marginLeft: 18 }}>구독자:{formatSubscriberCount(subscriberCount)}명</span>
            </span>
          </div>
          <button className={styles['channel-button']} onClick={handleChannelButton}>
            채널 바로가기
          </button>
        </header>
        <p className={styles['channel-description']}>{channelDescription}</p>
      </div>
    </section>
  )
}

export default VidoeInfo
