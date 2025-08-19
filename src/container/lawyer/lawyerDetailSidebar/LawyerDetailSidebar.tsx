import LawyerVertical from '@/components/lawyer/LawyerVertical'
import styles from './lawyer-detail-sidebar.module.scss'
import LegalTermWidget from '@/components/legalTermWidget/LegalTermWidget'
import { useLawyerKeep } from '@/hooks/queries/useLawyer'
import { useEffect, useState } from 'react'
import { copyUrlToClipboard } from '@/utils/clipboard'
import { RecommendationLegalTerm } from '@/types/recommendationTypes'

type LawyerDetailSidebarProps = {
  lawyerId: number
  lawyerName: string
  lawyerLawfirm: string
  lawyerProfileImage: string[]
  lawyerIsKeep: boolean
  recommendationLegalTerm: RecommendationLegalTerm[]
}

const LawyerDetailSidebar = ({
  lawyerId,
  lawyerName,
  lawyerLawfirm,
  lawyerProfileImage,
  lawyerIsKeep,
  recommendationLegalTerm,
}: LawyerDetailSidebarProps) => {
  const [isKeep, setIsKeep] = useState(lawyerIsKeep)

  useEffect(() => {
    setIsKeep(lawyerIsKeep)
  }, [lawyerIsKeep])

  const { mutate: changeLawyerKeep } = useLawyerKeep({
    onSuccess: data => {
      setIsKeep(data.isKeep)
    },
    onError: () => {
      setIsKeep(prevState => !prevState)
    },
  })

  const saveHandler = () => {
    setIsKeep(prevState => !prevState)
    changeLawyerKeep(lawyerId)
  }

  const shareHandler = () => {
    copyUrlToClipboard()
  }

  return (
    <div className={styles['lawyer-detail-sidebar']}>
      <LawyerVertical
        lawyerId={lawyerId}
        type={2}
        name={lawyerName}
        lawfirm={lawyerLawfirm}
        blogUrl='https://www.naver.com'
        youtubeUrl='https://www.youtube.com'
        instagramUrl='https://www.instagram.com'
        profileImage={lawyerProfileImage}
        className={styles['lawyer-vertical-container']}
        profileImageWidth='100%'
        profileImageHeight='234px'
        saveHandler={saveHandler}
        shareHandler={shareHandler}
        isKeep={isKeep}
        isShare={true}
      />
      <LegalTermWidget lagalTermList={recommendationLegalTerm || []} />
    </div>
  )
}

export default LawyerDetailSidebar
