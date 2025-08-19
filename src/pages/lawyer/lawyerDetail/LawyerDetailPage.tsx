import { Button } from 'antd'
import styles from './lawyer-detail.module.scss'

import React, { useRef } from 'react'
import { useParams } from 'react-router-dom'

const LawyerDetailPage = () => {
  const careerRef = useRef<HTMLElement>(null)
  const blogRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLElement>(null)
  const legalKnowledgeRef = useRef<HTMLElement>(null)
  const { lawyerId } = useParams()
  console.log('Lawyer ID:', lawyerId)

  // const { data: lawyerDetail } = useLawyerDetail(Number(lawyerId))
  // const lawyerDetail = {
  //   lawyerId: 1,
  //   lawyerName: '홍길동',
  //   lawyerDescription: '홍길동은 법률 전문가입니다.',
  //   lawfirmName: '홍길동 법률사무소',
  //   lawfirmAddress: '서울시 강남구 역삼동',
  //   lawfirmContact: '010-1234-5678',
  //   tags: [
  //     { id: 1, name: '법률' },
  //     { id: 2, name: '법률사무소' },
  //   ],
  //   statistics: {
  //     blogPostCount: 10,
  //     videoCount: 10,
  //     knowledgeAnswerCount: 10,
  //   },
  //   createdAt: '2021-01-01',
  //   isKeep: true,
  //   lawyerProfileImages: [
  //     { imageUrl: 'https://via.placeholder.com/150', isDefault: true },
  //     { imageUrl: 'https://via.placeholder.com/150', isDefault: false },
  //   ],
  //   achievements: [],
  // }

  const scrollToSection = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // const { data: recommendationLegalTerm } = useRecommendationLegalTerm({
  //   knowledgeIds: lawyerDetail?.consultationRequests.map(request => request.knowledgeId) ?? [],
  //   blogCaseIds: lawyerDetail?.blogCases.map(blog => blog.blogCaseId) ?? [],
  //   videoCaseIds: lawyerDetail?.videoCases.map(video => video.videoCaseId) ?? [],
  // })

  // const lawyerProfileImages = lawyerDetail?.lawyerProfileImages.map(image => image.imageUrl)

  return (
    <main className='sub-main-container'>
      <header className={styles['lawyer-detail__header']}>
        <div className={styles['lawyer-detail__header-actions']}>
          <Button>홈페이지에서 보기</Button>
          <Button>변호사 정보 변경하기</Button>
        </div>
      </header>
      <section className='contents-section'>
        {/* <LawyerProfile
          lawyerId={lawyerDetail?.lawyerId ?? 0}
          lawyerName={lawyerDetail?.lawyerName ?? ''}
          discription={lawyerDetail?.lawyerDescription ?? ''}
          lawyerLawfirm={lawyerDetail?.lawfirmName ?? ''}
          lawyerAdress={lawyerDetail?.lawfirmAddress ?? ''}
          lawfirmContact={lawyerDetail?.lawfirmContact ?? ''}
          tags={lawyerDetail?.tags ?? []}
        /> */}
        {/* <LawyerActivity statistics={lawyerDetail?.statistics ?? null} 
            createdAt={lawyerDetail?.createdAt ?? ''} /> */}
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
        {/* <LawyerCareer
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
        /> */}
      </section>
      {/* <aside className='aside'>
        <LawyerDetailSidebar
          lawyerId={lawyerDetail?.lawyerId ?? 0}
          lawyerName={lawyerDetail?.lawyerName ?? ''}
          lawyerLawfirm={lawyerDetail?.lawfirmName ?? ''}
          // lawyerProfileImage={lawyerProfileImages ?? []}
          lawyerIsKeep={lawyerDetail?.isKeep!}
          // recommendationLegalTerm={recommendationLegalTerm || []}
        />
      </aside> */}
    </main>
  )
}

export default LawyerDetailPage
