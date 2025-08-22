import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, DatePicker, Space, Select, Input, Upload, message, Image } from 'antd'
import { CalendarOutlined, UploadOutlined } from '@ant-design/icons'
import dayjs, { Dayjs } from 'dayjs'
import {
  useSubCategoryBannerDetail,
  useCreateSubCategoryBanner,
  useUpdateSubCategoryBanner,
} from '@/hooks/queries/useAdBanner'
import { useCategory } from '@/hooks/queries/useCategory'
import { SubCategoryBanner, SubCategoryBannerCreate } from '@/types/adBannerTypes'
import { useFileUpload } from '@/hooks/useFileUpload'
import { ROUTE_PATH } from '@/routes/routePath'
import styles from './subCategoryBannerEdit.module.scss'

const SubCategoryBannerEditPage = () => {
  const navigate = useNavigate()
  const { subCategoryBannerId } = useParams<{ subCategoryBannerId: string }>()
  const isEditMode = !!subCategoryBannerId

  // Form state
  const [bannerName, setBannerName] = useState<string>('')
  const [startDate, setStartDate] = useState<Dayjs | null>(null)
  const [startHour, setStartHour] = useState<string>('00')
  const [startMinute, setStartMinute] = useState<string>('00')
  const [endDate, setEndDate] = useState<Dayjs | null>(null)
  const [endHour, setEndHour] = useState<string>('23')
  const [endMinute, setEndMinute] = useState<string>('59')
  const [pcImageUrl, setPcImageUrl] = useState<string | null>(null)
  const [bannerLink, setBannerLink] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>()
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | undefined>()

  // Hooks
  const { data: bannerDetail } = useSubCategoryBannerDetail(Number(subCategoryBannerId))
  const { data: categories } = useCategory()
  const { uploadFile, isUploading } = useFileUpload()
  const createMutation = useCreateSubCategoryBanner()
  const updateMutation = useUpdateSubCategoryBanner()

  // 선택된 카테고리의 서브카테고리 필터링
  const selectedCategoryData = categories?.find(cat => cat.categoryId === selectedCategory)
  const subcategories = selectedCategoryData?.subcategories || []

  // Load existing data in edit mode
  useEffect(() => {
    if (isEditMode && bannerDetail) {
      setBannerName(bannerDetail.subBannerName)
      setBannerLink(bannerDetail.subBannerLink || '')
      setPcImageUrl(bannerDetail.subBannerImageUrl)
      setSelectedSubCategory(bannerDetail.subBannerSubCategoryId)

      // Find category from subcategory
      if (categories && bannerDetail.subBannerSubCategoryId) {
        const category = categories.find(cat =>
          cat.subcategories.some(sub => sub.subcategoryId === bannerDetail.subBannerSubCategoryId)
        )
        if (category) {
          setSelectedCategory(category.categoryId)
        }
      }

      // Set start date and time
      const startDateTime = dayjs(bannerDetail.subBannerStartedAt)
      setStartDate(startDateTime)
      setStartHour(startDateTime.format('HH'))
      setStartMinute(startDateTime.format('mm'))

      // Set end date and time
      const endDateTime = dayjs(bannerDetail.subBannerFinishedAt)
      setEndDate(endDateTime)
      setEndHour(endDateTime.format('HH'))
      setEndMinute(endDateTime.format('mm'))
    }
  }, [isEditMode, bannerDetail, categories])

  const handlePcImageUpload = async (file: File) => {
    try {
      const result = await uploadFile(file, {
        folder: 'banner/subcategory/pc',
        maxSize: 10,
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      })
      setPcImageUrl(result.fileUrl)
      message.success('PC 배너 이미지가 업로드되었습니다.')
    } catch {
      message.error('PC 배너 이미지 업로드에 실패했습니다.')
    }
    return false
  }

  const handleRemovePcImage = () => {
    setPcImageUrl(null)
  }

  const handleReuploadPcImage = async (file: File) => {
    await handlePcImageUpload(file)
    return false
  }

  // 카테고리 변경 시 서브카테고리 초기화
  const handleCategoryChange = (categoryId: number | undefined) => {
    setSelectedCategory(categoryId)
    setSelectedSubCategory(undefined)
  }

  const handleSave = () => {
    // Validation
    if (!bannerName.trim()) {
      message.warning('배너이름을 입력해주세요.')
      return
    }
    if (!selectedSubCategory) {
      message.warning('서브카테고리를 선택해주세요.')
      return
    }
    if (!startDate || !endDate) {
      message.warning('배너 노출기간을 선택해주세요.')
      return
    }
    if (startDate.isAfter(endDate)) {
      message.warning('시작일이 종료일보다 늦을 수 없습니다.')
      return
    }
    if (!pcImageUrl) {
      message.warning('PC 배너 이미지를 등록해주세요.')
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

    const requestData: SubCategoryBannerCreate | SubCategoryBanner = {
      ...(isEditMode && { subBannerId: Number(subCategoryBannerId) }),
      subBannerName: bannerName,
      subBannerImageUrl: pcImageUrl,
      subBannerStartedAt: startDateTime,
      subBannerFinishedAt: endDateTime,
      ...(bannerLink && { subBannerLink: bannerLink }),
      subBannerDisplayOrder: 0,
      subBannerIsActive: true,
      subBannerSubCategoryId: selectedSubCategory,
      ...(isEditMode &&
        bannerDetail && {
          subBannerCreatedAt: bannerDetail.subBannerCreatedAt,
          subBannerUpdatedAt: new Date().toISOString(),
        }),
    }

    if (isEditMode) {
      updateMutation.mutate(requestData as SubCategoryBanner, {
        onSuccess: () => {
          message.success('서브 카테고리 배너가 수정되었습니다.')
          navigate(`${ROUTE_PATH.AD_BANNER}/sub-category`)
        },
        onError: () => {
          message.error('서브 카테고리 배너 수정에 실패했습니다.')
        },
      })
    } else {
      createMutation.mutate(requestData as SubCategoryBannerCreate, {
        onSuccess: () => {
          message.success('서브 카테고리 배너가 등록되었습니다.')
          navigate(`${ROUTE_PATH.AD_BANNER}/sub-category`)
        },
        onError: () => {
          message.error('서브 카테고리 배너 등록에 실패했습니다.')
        },
      })
    }
  }

  const handleCancel = () => {
    navigate(`${ROUTE_PATH.AD_BANNER}/sub-category`)
  }

  const isFormValid = () => {
    return !!bannerName.trim() && !!startDate && !!endDate && !!pcImageUrl && !!selectedSubCategory
  }

  const hourOptions = Array.from({ length: 24 }, (_, i) => ({
    value: i.toString().padStart(2, '0'),
    label: `${i.toString().padStart(2, '0')}시`,
  }))

  const minuteOptions = Array.from({ length: 60 }, (_, i) => ({
    value: i.toString().padStart(2, '0'),
    label: `${i.toString().padStart(2, '0')}분`,
  }))

  return (
    <div className={styles.subCategoryBannerEditPage}>
      <header className={styles.subCategoryBannerEditPage__header}>
        <Space>
          <Button size='large' onClick={handleCancel}>
            취소
          </Button>
          <Button
            type='primary'
            size='large'
            onClick={handleSave}
            loading={createMutation.isPending || updateMutation.isPending}
            disabled={!isFormValid()}
          >
            {isEditMode ? '분류별 서브메인 배너 수정 완료' : '분류별 서브메인 배너 등록 완료'}
          </Button>
        </Space>
      </header>

      <section className={styles.subCategoryBannerEditPage__form}>
        {/* 분류 선택 */}
        <div className={styles.formRow}>
          <div className={styles.labelCol}>
            <label className={styles.label}>분류 선택</label>
          </div>
          <div className={styles.inputCol}>
            <div className={styles.dropdownGroup}>
              <Select
                value={selectedCategory}
                onChange={handleCategoryChange}
                style={{ width: 200 }}
                placeholder='카테고리를 선택하세요'
                allowClear
                size='large'
                options={categories?.map(cat => ({
                  value: cat.categoryId,
                  label: cat.categoryName,
                }))}
              />
              <Select
                value={selectedSubCategory}
                onChange={setSelectedSubCategory}
                style={{ width: 200 }}
                placeholder='서브카테고리를 선택하세요'
                disabled={!selectedCategory || subcategories.length === 0}
                allowClear
                size='large'
                options={subcategories.map(sub => ({
                  value: sub.subcategoryId,
                  label: sub.subcategoryName,
                }))}
              />
            </div>
          </div>
        </div>

        {/* 배너이름 */}
        <div className={styles.formRow}>
          <div className={styles.labelCol}>
            <label className={styles.label}>배너이름</label>
          </div>
          <div className={styles.inputCol}>
            <Input
              value={bannerName}
              onChange={e => setBannerName(e.target.value)}
              placeholder='배너이름을 입력해주세요'
              size='large'
              style={{ width: 400 }}
            />
          </div>
        </div>

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

        {/* PC 배너 이미지 등록 */}
        <div className={styles.formRow}>
          <div className={styles.labelCol}>
            <label className={styles.label}>PC 배너 이미지 등록</label>
          </div>
          <div className={styles.inputCol}>
            <div className={styles.uploadSection}>
              {pcImageUrl ? (
                <div className={styles.imageContainer}>
                  <div className={styles.imagePreviewWrapper}>
                    <Image
                      src={pcImageUrl}
                      alt='PC 배너 이미지'
                      style={{ width: '405px', height: '135px', objectFit: 'cover' }}
                      preview={{
                        mask: '미리보기',
                      }}
                    />
                  </div>
                  <div className={styles.imageActions}>
                    <Button type='primary' danger size='small' onClick={handleRemovePcImage}>
                      배너삭제
                    </Button>
                    <Upload
                      beforeUpload={handleReuploadPcImage}
                      showUploadList={false}
                      accept='image/*'
                      disabled={isUploading}
                    >
                      <Button size='small' loading={isUploading}>
                        배너수정
                      </Button>
                    </Upload>
                  </div>
                </div>
              ) : (
                <div className={styles.uploadContainer}>
                  <div className={styles.uploadNote}>
                    <ul>
                      <li>PC 배너 권장 사이즈는 810 x 270 입니다.</li>
                      <li>배너 내비게이션 위치를 고려해서 등록 바랍니다.</li>
                      <li>미리보기는 실제 비율로 표시됩니다.</li>
                    </ul>
                  </div>
                  <Upload
                    beforeUpload={handlePcImageUpload}
                    showUploadList={false}
                    accept='image/*'
                    disabled={isUploading}
                  >
                    <Button icon={<UploadOutlined />} size='large' loading={isUploading}>
                      배너등록
                    </Button>
                  </Upload>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default SubCategoryBannerEditPage
