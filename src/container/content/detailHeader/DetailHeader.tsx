import styles from './detail-header.module.scss'

import { SaveOutlined, ShareAltOutlined } from '@ant-design/icons'
import { Button } from 'antd'

type DetailHeaderProps = {
  title: string
  onShare?: () => void
  onSave?: () => void
}

const DetailHeader = ({ title, onShare, onSave }: DetailHeaderProps) => {
  return (
    <div className={styles['detail-header']}>
      <h1>{title}</h1>
      <div className={styles['button-wrapper']}>
        {onShare && (
          <Button onClick={onShare}>
            공유
            <ShareAltOutlined />
          </Button>
        )}
        {onSave && (
          <Button onClick={onSave}>
            저장 <SaveOutlined />
          </Button>
        )}
      </div>
    </div>
  )
}

export default DetailHeader
