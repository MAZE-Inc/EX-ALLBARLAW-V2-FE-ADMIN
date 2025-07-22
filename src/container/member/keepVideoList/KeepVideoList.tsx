import VideoItem from '@/components/videoItem/VideoItem'
import styles from './keepVideoList.module.scss'
import { Divider } from 'antd'

const KeepVideoList = () => {
  const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  return (
    <div className={styles.keepVideoList}>
      {array.map((item, index) => (
        <>
          <VideoItem
            key={item}
            thumbnailUrl='https://picsum.photos/400/300'
            title='법률정보의 글'
            lawyerName='법률정보의 글'
            lawfirmName='법률정보의 글'
            channelName='법률정보의 글'
            channelThumbnail='https://picsum.photos/150/150'
            summaryContents={`음주후 주차장등에서 잠깐 운전하다가 적발될 경우, 
    처벌받을 수 있습니다.혈중알코올 농도가 0.03% 이상이면 음주운전으로 간주되어 처벌대상이 됩니다.
    음주후 주차장등에서 잠깐 운전하다가 적발될 경우, 처벌받을 수 있습니다.
    혈중알코올 농도가 0.03% 이상이면 음주운전으로 간주되어 처벌대상이 됩니다.`}
          />
          {index !== array.length - 1 && <Divider />}
        </>
      ))}
    </div>
  )
}

export default KeepVideoList
