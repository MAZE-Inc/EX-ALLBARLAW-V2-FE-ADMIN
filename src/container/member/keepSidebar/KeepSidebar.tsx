import styles from './keepSidebar.module.scss'

interface KeepButton {
  name: string
  count: number
}

interface KeepSidebarProps {
  buttonList: KeepButton[]
  activeButton: string
  setActiveButton: (button: string) => void
}

const KeepSidebar = ({ buttonList, activeButton, setActiveButton }: KeepSidebarProps) => {
  return (
    <div className={styles.keepSidebar}>
      {buttonList.map(button => (
        <button
          key={button.name}
          className={`${styles.keepSidebarButton} ${activeButton === button.name ? styles.active : ''}`}
          onClick={() => setActiveButton(button.name)}
        >
          <span>{button.name}</span>
          <span>({button.count})</span>
        </button>
      ))}
    </div>
  )
}

export default KeepSidebar
