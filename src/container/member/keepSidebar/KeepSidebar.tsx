import styles from './keepSidebar.module.scss'

interface KeepSidebarProps {
  buttonList: string[]
  activeButton: string
  setActiveButton: (button: string) => void
}

const KeepSidebar = ({ buttonList, activeButton, setActiveButton }: KeepSidebarProps) => {
  return (
    <div className={styles.keepSidebar}>
      {buttonList.map(button => (
        <button
          key={button}
          className={`${styles.keepSidebarButton} ${activeButton === button ? styles.active : ''}`}
          onClick={() => setActiveButton(button)}
        >
          <span>{button}</span>
          <span>(1)</span>
        </button>
      ))}
    </div>
  )
}

export default KeepSidebar
