import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, DatePicker, Space, Select, message } from 'antd'
import { CalendarOutlined } from '@ant-design/icons'
import dayjs, { Dayjs } from 'dayjs'
import LawyerHorizon from '@/components/lawyer/LawyerHorizon'
import LawyerSearchModal from '@/components/modal/LawyerSearchModal'
import { useAdLawyerCreate, useAdLawyerUpdate, useAdLawyerDetail } from '@/hooks/queries/useLawyer'
import { AdLawyerUpdateRequest, LawyerSearchResult } from '@/types/lawyerTypes'
import { ROUTE_PATH } from '@/routes/routePath'
import styles from './adLawyerEdit.module.scss'
import SearchHeader from '@/components/searchHeader/SearchHeader'

const AdLawyerEditPage = () => {
  const navigate = useNavigate()
  const { lawyerAdId } = useParams<{ lawyerAdId: string }>()
  const isEditMode = !!lawyerAdId

  // Form state
  const [startDate, setStartDate] = useState<Dayjs | null>(null)
  const [startHour, setStartHour] = useState<string>('00')
  const [startMinute, setStartMinute] = useState<string>('00')
  const [endDate, setEndDate] = useState<Dayjs | null>(null)
  const [endHour, setEndHour] = useState<string>('23')
  const [endMinute, setEndMinute] = useState<string>('59')
  const [selectedLawyer, setSelectedLawyer] = useState<LawyerSearchResult | null>(null)

  const [isLawyerModalOpen, setIsLawyerModalOpen] = useState(false)

  const { data: adLawyerDetail } = useAdLawyerDetail(Number(lawyerAdId), isEditMode)

  const createAdLawyerMutation = useAdLawyerCreate(
    () => {
      message.success('광고가 등록되었습니다.')
      navigate(ROUTE_PATH.AD_LAWYER)
    },
    () => {
      message.error('광고 등록에 실패했습니다.')
    }
  )

  const updateAdLawyerMutation = useAdLawyerUpdate(
    Number(lawyerAdId),
    () => {
      message.success('광고가 수정되었습니다.')
      navigate(ROUTE_PATH.AD_LAWYER)
    },
    () => {
      message.error('광고 수정에 실패했습니다.')
    }
  )

  // Load existing data in edit mode
  useEffect(() => {
    if (isEditMode && adLawyerDetail) {
      // Set start date and time
      const startDateTime = dayjs(adLawyerDetail.lawyerAdStartedAt)
      setStartDate(startDateTime)
      setStartHour(startDateTime.format('HH'))
      setStartMinute(startDateTime.format('mm'))

      // Set end date and time
      const endDateTime = dayjs(adLawyerDetail.lawyerAdFinishedAt)
      setEndDate(endDateTime)
      setEndHour(endDateTime.format('HH'))
      setEndMinute(endDateTime.format('mm'))

      // Set lawyer info
      const lawyerInfo = {
        lawyerId: adLawyerDetail.lawyerAdLawyerId,
        lawyerName: adLawyerDetail.lawyerAdLawyerName,
        lawyerProfileImage: adLawyerDetail.lawyerAdLawyerProfileImage || '',
        lawyerDescription: adLawyerDetail.lawyerAdLawyerDescription || '',
        lawyerLawfirmName: '법무법인',
        lawyerCreatedAt: adLawyerDetail.lawyerAdCreatedAt,
      }
      console.log('Setting lawyer info:', lawyerInfo)
      setSelectedLawyer(lawyerInfo)
    }
  }, [isEditMode, adLawyerDetail])

  const handleSelectLawyer = () => {
    setIsLawyerModalOpen(true)
  }

  const handleLawyerSelect = (lawyer: any) => {
    setSelectedLawyer(lawyer)
    setIsLawyerModalOpen(false)
  }

  const handleModalCancel = () => {
    setIsLawyerModalOpen(false)
  }

  const handleSave = () => {
    // Validation
    if (!startDate || !endDate) {
      message.warning('배너 노출기간을 선택해주세요.')
      return
    }
    if (!selectedLawyer) {
      message.warning('변호사를 선택해주세요.')
      return
    }
    if (startDate.isAfter(endDate)) {
      message.warning('시작일이 종료일보다 늦을 수 없습니다.')
      return
    }

    const startDateTime = startDate
      .set('hour', parseInt(startHour))
      .set('minute', parseInt(startMinute))
      .set('second', 0)
      .toISOString()

    const endDateTime = endDate
      .set('hour', parseInt(endHour))
      .set('minute', parseInt(endMinute))
      .set('second', 0)
      .toISOString()

    const requestData: AdLawyerUpdateRequest = {
      lawyerAdLawyerId: selectedLawyer.lawyerId,
      lawyerAdStartedAt: startDateTime,
      lawyerAdFinishedAt: endDateTime,
    }

    if (isEditMode) {
      updateAdLawyerMutation.mutate(requestData)
    } else {
      createAdLawyerMutation.mutate(requestData)
    }
  }

  const handleCancel = () => {
    navigate(ROUTE_PATH.AD_LAWYER)
  }

  const isFormValid = () => {
    return !!startDate && !!endDate && !!selectedLawyer
  }

  const hourOptions = Array.from({ length: 24 }, (_, i) => ({
    value: i.toString().padStart(2, '0'),
    label: `${i.toString().padStart(2, '0')}시`,
  }))

  const minuteOptions = Array.from({ length: 60 }, (_, i) => ({
    value: i.toString().padStart(2, '0'),
    label: `${i.toString().padStart(2, '0')}분`,
  }))

  const onSearch = (value: string) => {
    // 검색어와 함께 리스트 페이지로 이동
    if (value.trim()) {
      navigate(`${ROUTE_PATH.AD_LAWYER}?search=${encodeURIComponent(value)}`)
    } else {
      navigate(ROUTE_PATH.AD_LAWYER)
    }
  }
  return (
    <>
      <SearchHeader
        bordered={false}
        menuItems={[{ label: '변호사 이름', key: 'lawyerName' }]}
        selectedItem={{ label: '변호사 이름', key: 'lawyerName' }}
        title={isEditMode ? '변호사 광고 수정 화면입니다. ' : '변호사 광고 등록 화면입니다. '}
        onSearch={onSearch}
      />
      <div className={styles.adLawyerEditPage}>
        <h1 className={styles.adLawyerEditPage__title}>
          <span>♦</span> {isEditMode ? '메인화면배너광고 수정' : '메인화면배너광고 등록'}
        </h1>

        <section className={styles.adLawyerEditPage__form}>
          {/* 배너 노출기간 */}
          <div className={styles.formRow}>
            <div className={styles.labelCol}>
              <label className={styles.label}>배너 노출기간</label>
            </div>
            <div className={styles.inputCol}>
              <div className={styles.dateTimeWrapper}>
                {/* 시작 일시 */}
                <div className={styles.dateTimeRow}>
                  <span className={styles.dateLabel}>시작 일시</span>
                  <DatePicker
                    value={startDate}
                    onChange={setStartDate}
                    format='YYYY-MM-DD'
                    placeholder='날짜 선택'
                    suffixIcon={<CalendarOutlined />}
                    size='large'
                    style={{ width: 150 }}
                  />
                  <Select
                    value={startHour}
                    onChange={setStartHour}
                    options={hourOptions}
                    size='large'
                    style={{ width: 80 }}
                  />
                  <Select
                    value={startMinute}
                    onChange={setStartMinute}
                    options={minuteOptions}
                    size='large'
                    style={{ width: 80 }}
                  />
                </div>

                {/* 종료 일시 */}
                <div className={styles.dateTimeRow}>
                  <span className={styles.dateLabel}>종료 일시</span>
                  <DatePicker
                    value={endDate}
                    onChange={setEndDate}
                    format='YYYY-MM-DD'
                    placeholder='날짜 선택'
                    suffixIcon={<CalendarOutlined />}
                    size='large'
                    style={{ width: 150 }}
                  />
                  <Select
                    value={endHour}
                    onChange={setEndHour}
                    options={hourOptions}
                    size='large'
                    style={{ width: 80 }}
                  />
                  <Select
                    value={endMinute}
                    onChange={setEndMinute}
                    options={minuteOptions}
                    size='large'
                    style={{ width: 80 }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 변호사 선택 */}
          <div className={styles.formRow}>
            <div className={styles.labelCol}>
              <label className={styles.label}>변호사 선택</label>
            </div>
            <div className={styles.inputCol}>
              <Button type='primary' size='large' onClick={handleSelectLawyer} className={styles.selectButton}>
                변호사 검색
              </Button>
            </div>
          </div>

          {/* 실제 노출된 화면 */}
          <div className={styles.formRow}>
            <div className={styles.labelCol}>
              <label className={styles.label}>실제 노출된 화면</label>
            </div>
            <div className={styles.inputCol}>
              {selectedLawyer ? (
                <div className={styles.lawyerPreview}>
                  <LawyerHorizon
                    name={selectedLawyer.lawyerName}
                    profileImage={selectedLawyer.lawyerProfileImage || ''}
                    description={selectedLawyer.lawyerDescription || ''}
                    lawfirm={selectedLawyer.lawyerLawfirmName || '법무법인 일신 강남분사무소'}
                    tags={[]}
                    size='small'
                    ad={true}
                  />
                </div>
              ) : (
                <div className={styles.emptyPreview}>변호사를 선택해주세요</div>
              )}
            </div>
          </div>
        </section>

        {/* 액션 버튼 */}
        <div className={styles.adLawyerEditPage__actions}>
          <Space>
            <Button size='large' onClick={handleCancel}>
              취소
            </Button>
            <Button
              type='primary'
              size='large'
              onClick={handleSave}
              loading={isEditMode ? updateAdLawyerMutation.isPending : createAdLawyerMutation.isPending}
              disabled={!isFormValid()}
            >
              {isEditMode ? '수정' : '저장'}
            </Button>
          </Space>
        </div>

        {/* 변호사 검색 모달 */}
        <LawyerSearchModal open={isLawyerModalOpen} onCancel={handleModalCancel} onSelect={handleLawyerSelect} />
      </div>
    </>
  )
}

export default AdLawyerEditPage
