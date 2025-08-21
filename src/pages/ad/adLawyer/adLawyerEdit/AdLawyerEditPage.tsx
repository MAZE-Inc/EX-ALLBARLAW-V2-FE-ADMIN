import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, DatePicker, Space, Select, message } from 'antd'
import { CalendarOutlined } from '@ant-design/icons'
import { Dayjs } from 'dayjs'
import LawyerHorizon from '@/components/lawyer/LawyerHorizon'
import LawyerSearchModal from '@/components/modal/LawyerSearchModal'
import { useAdLawyerCreate } from '@/hooks/queries/useLawyer'
import { AdLawyerUpdateRequest } from '@/types/lawyerTypes'
import { ROUTE_PATH } from '@/routes/routePath'
import styles from './adLawyerEdit.module.scss'

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
  const [selectedLawyer, setSelectedLawyer] = useState<any>(null)

  // Modal state
  const [isLawyerModalOpen, setIsLawyerModalOpen] = useState(false)

  const createAdLawyerMutation = useAdLawyerCreate(
    () => {
      message.success(isEditMode ? '광고가 수정되었습니다.' : '광고가 등록되었습니다.')
      navigate(ROUTE_PATH.AD_LAWYER)
    },
    () => {
      message.error(isEditMode ? '광고 수정에 실패했습니다.' : '광고 등록에 실패했습니다.')
    }
  )

  // Load existing data in edit mode
  useEffect(() => {
    if (isEditMode && lawyerAdId) {
      // TODO: Load existing ad data
      // const loadAdData = async () => {
      //   const data = await lawyerService.getAdLawyerDetail(lawyerAdId)
      //   setStartDate(dayjs(data.lawyerAdStartedAt))
      //   setEndDate(dayjs(data.lawyerAdFinishedAt))
      //   setSelectedLawyer(data.lawyer)
      // }
      // loadAdData()
    }
  }, [isEditMode, lawyerAdId])

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

    const requestData: AdLawyerUpdateRequest = {
      lawyerAdLawyerId: selectedLawyer.lawyerId,
      lawyerAdStartedAt: `${startDate.format('YYYY-MM-DD')} ${startHour}:${startMinute}:00`,
      lawyerAdFinishedAt: `${endDate.format('YYYY-MM-DD')} ${endHour}:${endMinute}:00`,
    }

    createAdLawyerMutation.mutate(requestData)
  }

  const handleCancel = () => {
    navigate(ROUTE_PATH.AD_LAWYER)
  }

  const isFormValid = () => {
    return !!startDate && !!endDate && !!selectedLawyer
  }

  // Generate hour and minute options
  const hourOptions = Array.from({ length: 24 }, (_, i) => ({
    value: i.toString().padStart(2, '0'),
    label: `${i.toString().padStart(2, '0')}시`,
  }))

  const minuteOptions = Array.from({ length: 60 }, (_, i) => ({
    value: i.toString().padStart(2, '0'),
    label: `${i.toString().padStart(2, '0')}분`,
  }))

  return (
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
                  tags={[
                    { id: 1, name: '재산분할' },
                    { id: 2, name: '형사' },
                    { id: 3, name: '재임용' },
                  ]}
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
            loading={createAdLawyerMutation.isPending}
            disabled={!isFormValid()}
          >
            {isEditMode ? '수정' : '저장'}
          </Button>
        </Space>
      </div>

      {/* 변호사 검색 모달 */}
      <LawyerSearchModal open={isLawyerModalOpen} onCancel={handleModalCancel} onSelect={handleLawyerSelect} />
    </div>
  )
}

export default AdLawyerEditPage
