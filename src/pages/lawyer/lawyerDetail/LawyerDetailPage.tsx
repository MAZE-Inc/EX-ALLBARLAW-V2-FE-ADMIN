import { Button } from 'antd'
import styles from './lawyer-detail.module.scss'

import React, { useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLawyerDetail } from '@/hooks/queries/useLawyer'
import LawyerProfile from '@/container/lawyer/lawyerProfile/LawyerProfile'
import LawyerDetailSidebar from '@/container/lawyer/lawyerDetailSidebar/LawyerDetailSidebar'
import LawyerActivity from '@/container/lawyer/lawyerActivity/LawyerActivity'
import LawyerCareer from '@/container/lawyer/lawyerCareer/LawyerCareer'
import LawyerBlog from '@/container/lawyer/lawyerBlog/LawyerBlog'
import LawyerVideo from '@/container/lawyer/lawyerVideo/LawyerVideo'
import LawyerLegalKnowledge from '@/container/lawyer/lawyerLegalKnowledge/LawyerLegalKnowledge'
import LawyerAchievements from '@/container/lawyer/lawyerAchievements/LawyerAchievements'
import { COLOR } from '@/styles/abstracts/color'

const LawyerDetailPage = () => {
  const careerRef = useRef<HTMLElement>(null)
  const blogRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLElement>(null)
  const legalKnowledgeRef = useRef<HTMLElement>(null)
  const { lawyerId } = useParams()
  const { data: lawyerDetail } = useLawyerDetail(Number(lawyerId))
  const navigate = useNavigate()

  const scrollToSection = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const lawyerProfileImages = lawyerDetail?.lawyerProfileImages.map(image => image.imageUrl)

  const handleOpenHomepage = () => {
    window.open(`${import.meta.env.VITE_USER_URL}/search/lawyer/${lawyerId}`, '_blank')
  }

  const handleOpenEditPage = () => {
    navigate(`/lawyer-management/lawyer/edit/${lawyerId}`)
  }

  return (
    <>
      <header className={styles['lawyer-detail__header']}>
        <div className={styles['lawyer-detail__header-actions']}>
          <Button onClick={handleOpenHomepage}>홈페이지에서 보기</Button>
          <Button onClick={handleOpenEditPage}>변호사 정보 변경하기</Button>
        </div>
      </header>
      <main className='sub-main-container' style={{ padding: '16px', backgroundColor: COLOR.GRAY_01 }}>
        <section className='contents-section'>
          <LawyerProfile
            lawyerId={lawyerDetail?.lawyerId ?? 0}
            lawyerName={lawyerDetail?.lawyerName ?? ''}
            discription={lawyerDetail?.lawyerDescription ?? ''}
            lawyerLawfirm={lawyerDetail?.lawfirmName ?? ''}
            lawyerAdress={lawyerDetail?.lawfirmAddress ?? ''}
            lawfirmContact={lawyerDetail?.lawfirmContact ?? ''}
            tags={lawyerDetail?.tags ?? []}
          />
          <LawyerActivity statistics={lawyerDetail?.statistics ?? null} createdAt={lawyerDetail?.createdAt ?? ''} />
          <LawyerAchievements achievements={lawyerDetail?.achievements ?? []} />
          <section className={styles['lawyer-detail__button-container']}>
            <button className={styles['lawyer-detail__button']} onClick={() => scrollToSection(careerRef)}>
              이력사항 및 활동사항
            </button>
            <button className={styles['lawyer-detail__button']} onClick={() => scrollToSection(blogRef)}>
              <span>법률정보의 글</span>
              <span>(10)</span>
            </button>
            <button className={styles['lawyer-detail__button']} onClick={() => scrollToSection(videoRef)}>
              <span>법률영상</span>
              <span>(10)</span>
            </button>
            <button className={styles['lawyer-detail__button']} onClick={() => scrollToSection(legalKnowledgeRef)}>
              <span>법률지식인</span>
              <span>(10)</span>
            </button>
          </section>
          <LawyerCareer
            ref={careerRef}
            careerHistory={lawyerDetail?.careers ?? []}
            activities={lawyerDetail?.activities ?? []}
          />
          <LawyerBlog
            ref={blogRef}
            blogList={lawyerDetail?.blogCases ?? []}
            lawyerId={Number(lawyerId)}
            lawyerName={lawyerDetail?.lawyerName ?? ''}
          />
          <LawyerVideo
            ref={videoRef}
            videoList={lawyerDetail?.videoCases ?? []}
            lawyerId={Number(lawyerId)}
            lawyerName={lawyerDetail?.lawyerName ?? ''}
          />
          <LawyerLegalKnowledge
            ref={legalKnowledgeRef}
            knowledgeList={lawyerDetail?.consultationRequests ?? []}
            lawyerId={Number(lawyerId)}
            lawyerName={lawyerDetail?.lawyerName ?? ''}
          />
        </section>
        <aside className='aside'>
          <LawyerDetailSidebar
            lawyerId={lawyerDetail?.lawyerId ?? 0}
            lawyerName={lawyerDetail?.lawyerName ?? ''}
            lawyerLawfirm={lawyerDetail?.lawfirmName ?? ''}
            lawyerProfileImage={lawyerProfileImages ?? []}
            lawyerIsKeep={lawyerDetail?.isKeep!}
            // recommendationLegalTerm={recommendationLegalTerm || []}
          />
        </aside>
      </main>
    </>
  )
}

export default LawyerDetailPage
