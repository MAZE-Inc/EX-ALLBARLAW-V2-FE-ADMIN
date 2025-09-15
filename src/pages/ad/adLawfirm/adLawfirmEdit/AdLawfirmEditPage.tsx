import SearchHeader, { SearchHeaderMenuItemType } from '@/components/searchHeader/SearchHeader'
import { useCategory } from '@/hooks/queries/useCategory'
import { useCreateLawfirm, useLawfirm, useUpdateLawfirm } from '@/hooks/queries/useLawfirm'
import { LawfirmApiRequest } from '@/types/lawfirmTypes'
import { PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Input, Radio, RadioChangeEvent, Select, Spin, message, Upload } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './adLawfirmEdit.module.scss'
import { ROUTE_PATH } from '@/routes/routePath'
import { adLawfirmMenuItems } from '../adLawfirmLayout/AdLawfirmLayout'
import { useFileUpload } from '@/hooks/useFileUpload'

const AdLawfirmEditPage = () => {
  const navigate = useNavigate()
  const { lawfirmId } = useParams<{ lawfirmId: string }>()
  const isEditMode = !!lawfirmId
  const { uploadFile, uploadMultipleFiles, isUploading } = useFileUpload()

  // URL 유효성 검증 함수
  const isValidUrl = (url: string): boolean => {
    try {
      // 빈 문자열은 허용
      if (!url) return true

      // 상대 경로는 허용
      if (url.startsWith('/')) return true

      // 절대 URL 검증
      const urlObj = new URL(url)

      // http, https 프로토콜만 허용
      if (!['http:', 'https:'].includes(urlObj.protocol)) return false

      // localhost는 거부
      if (urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1') return false

      return true
    } catch {
      return false
    }
  }

  const { data: categories, isLoading: categoriesLoading } = useCategory()
  const { data: lawfirmData, isLoading: lawfirmLoading } = useLawfirm(isEditMode ? Number(lawfirmId) : 0)

  const getMainCategoryIdBySubcategoryId = (subcategoryId: number) => {
    return categories?.find(cat => cat.subcategories.some(sub => sub.subcategoryId === subcategoryId))?.categoryId
  }

  const getMainCategoryId = useMemo(() => {
    if (!lawfirmData?.lawfirmSubcategoryId) return null
    return getMainCategoryIdBySubcategoryId(lawfirmData.lawfirmSubcategoryId)
  }, [categories, lawfirmData])

  // 법무법인 생성 훅
  const createLawfirmMutation = useCreateLawfirm({
    onSuccess: () => {
      message.success('법무법인이 등록되었습니다.')
      navigate(ROUTE_PATH.AD_LAWFIRM)
    },
    onError: () => {
      message.error('법무법인 등록 중 오류가 발생했습니다.')
    },
  })

  // 법무법인 수정 훅
  const updateLawfirmMutation = useUpdateLawfirm({
    onSuccess: () => {
      message.success('법무법인 정보가 수정되었습니다.')
      navigate(ROUTE_PATH.AD_LAWFIRM)
    },
    onError: () => {
      message.error('법무법인 수정 중 오류가 발생했습니다.')
    },
  })

  const [selectedItem, setSelectedItem] = useState<SearchHeaderMenuItemType | null>({
    label: '로펌이름',
    key: 'name',
  })
  const [formData, setFormData] = useState<LawfirmApiRequest>({
    lawfirmId: 0,
    lawfirmName: '',
    lawfirmEmail: '',
    lawfirmContact: '',
    lawfirmViewCount: 0,
    lawfirmSubcategoryId: 0,
    lawfirmDirects: [],
    lawfirmImages: [],
  })
  // 이미지를 로컬에서 관리하기 위한 별도 상태 (id 포함)
  const [localImages, setLocalImages] = useState<{ id: number; imageUrl: string }[]>([])
  // 바로가기 링크를 로컬에서 관리하기 위한 별도 상태 (id 포함)
  const [localDirects, setLocalDirects] = useState<{ id: number; name: string; link: string }[]>([])
  // URL 유효성 상태
  const [urlErrors, setUrlErrors] = useState<{ [key: number]: string }>({})

  const [isMemberType, setIsMemberType] = useState<'member' | 'nonMember'>('member')
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>()
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | undefined>()

  // 선택된 카테고리의 서브카테고리 필터링
  const selectedCategoryData = categories?.find(cat => cat.categoryId === selectedCategory)
  const subcategories = selectedCategoryData?.subcategories || []

  const handleSelectionChange = (item: SearchHeaderMenuItemType) => {
    setSelectedItem(item)
  }

  const handleInputChange = (field: keyof LawfirmApiRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleMemberTypeChange = (e: RadioChangeEvent) => {
    setIsMemberType(e.target.value)
  }

  const handleAddLink = () => {
    const newLink = {
      id: Date.now(),
      name: '',
      link: '',
    }
    setLocalDirects(prev => [...prev, newLink])
    setFormData(prev => ({
      ...prev,
      lawfirmDirects: [
        ...prev.lawfirmDirects,
        {
          name: '',
          link: '',
        },
      ],
    }))
  }

  const handleRemoveLink = (id: number) => {
    const indexToRemove = localDirects.findIndex(d => d.id === id)
    if (indexToRemove !== -1) {
      setLocalDirects(prev => prev.filter(d => d.id !== id))
      setFormData(prev => ({
        ...prev,
        lawfirmDirects: prev.lawfirmDirects.filter((_, index) => index !== indexToRemove),
      }))
    }
  }

  const handleLinkChange = (id: number, field: 'name' | 'link', value: string) => {
    // link 필드일 때 URL 유효성 검증
    if (field === 'link') {
      if (!isValidUrl(value)) {
        setUrlErrors(prev => ({
          ...prev,
          [id]: '유효한 URL 형식을 입력해주세요. (https://example.com 또는 /path)',
        }))
      } else {
        setUrlErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors[id]
          return newErrors
        })
      }
    }

    const index = localDirects.findIndex(d => d.id === id)
    if (index !== -1) {
      setLocalDirects(prev => prev.map(d => (d.id === id ? { ...d, [field]: value } : d)))
      setFormData(prev => ({
        ...prev,
        lawfirmDirects: prev.lawfirmDirects.map((link, i) => (i === index ? { ...link, [field]: value } : link)),
      }))
    }
  }

  const handleLogoUpload = async (file: File) => {
    try {
      const result = await uploadFile(file, {
        folder: 'lawfirm/logo',
        maxSize: 10,
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      })
      setFormData(prev => ({
        ...prev,
        lawfirmLogoImageUrl: result.fileUrl,
      }))
      message.success('로고가 업로드되었습니다.')
    } catch {
      message.error('로고 업로드에 실패했습니다.')
    }
    return false
  }

  const handleLogoRemove = () => {
    setFormData(prev => ({
      ...prev,
      lawfirmLogoImageUrl: '',
    }))
  }

  const handleImageUpload = async (file: File) => {
    try {
      const result = await uploadFile(file, {
        folder: 'lawfirm/images',
        maxSize: 10,
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      })
      const newImage = {
        id: Date.now() + Math.random(),
        imageUrl: result.fileUrl,
      }
      setLocalImages(prev => [...prev, newImage])
      setFormData(prev => ({
        ...prev,
        lawfirmImages: [...prev.lawfirmImages, { imageUrl: result.fileUrl }],
      }))
      message.success('이미지가 업로드되었습니다.')
    } catch {
      message.error('이미지 업로드에 실패했습니다.')
    }
    return false
  }

  const handleMultipleImageUpload = async (files: File[]) => {
    try {
      const results = await uploadMultipleFiles(files, {
        folder: 'lawfirm/images',
        maxSize: 10,
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      })
      const newLocalImages = results.map(result => ({
        id: Date.now() + Math.random(),
        imageUrl: result.fileUrl,
      }))
      const newFormImages = results.map(result => ({
        imageUrl: result.fileUrl,
      }))
      setLocalImages(prev => [...prev, ...newLocalImages])
      setFormData(prev => ({
        ...prev,
        lawfirmImages: [...prev.lawfirmImages, ...newFormImages],
      }))
      message.success(`${files.length}개의 이미지가 업로드되었습니다.`)
    } catch {
      message.error('이미지 업로드에 실패했습니다.')
    }
  }

  const handleImageRemove = (id: number) => {
    const imageToRemove = localImages.find(img => img.id === id)
    if (imageToRemove) {
      setLocalImages(prev => prev.filter(img => img.id !== id))
      setFormData(prev => ({
        ...prev,
        lawfirmImages: prev.lawfirmImages.filter(img => img.imageUrl !== imageToRemove.imageUrl),
      }))
    }
  }

  const validateForm = () => {
    const errors: string[] = []

    // 필수값 검증 (name, email, contact는 필수)
    if (!formData.lawfirmName?.trim()) errors.push('로펌 이름')
    if (!formData.lawfirmEmail?.trim()) errors.push('로펌 이메일')
    if (!formData.lawfirmContact?.trim()) errors.push('로펌 연락처')

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.lawfirmEmail && !emailRegex.test(formData.lawfirmEmail)) {
      message.error('올바른 이메일 형식을 입력해주세요.')
      return false
    }

    // URL 형식 검증 (선택사항이지만 입력된 경우만) - 한글 도메인 지원
    const urlRegex =
      /^(https?:\/\/)?(www\.)?[a-z0-9가-힣]+([-.]{1}[a-z0-9가-힣]+)*\.[a-z가-힣]{2,}(:[0-9]{1,5})?(\/.*)?$/i
    if (formData.lawfirmHomepageUrl && !urlRegex.test(formData.lawfirmHomepageUrl)) {
      message.error('올바른 홈페이지 URL 형식을 입력해주세요.')
      return false
    }
    if (formData.lawfirmBlogUrl && !urlRegex.test(formData.lawfirmBlogUrl)) {
      message.error('올바른 블로그 URL 형식을 입력해주세요.')
      return false
    }

    if (errors.length > 0) {
      message.error(`다음 필수 항목을 입력해주세요: ${errors.join(', ')}`)
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    // URL 유효성 검사
    if (Object.keys(urlErrors).length > 0) {
      message.warning('유효하지 않은 URL이 있습니다. 확인 후 다시 시도해주세요.')
      return
    }

    // LawfirmApiRequest 타입에 맞게 데이터 구성
    const submitData: LawfirmApiRequest = {
      lawfirmId: formData.lawfirmId,
      lawfirmName: formData.lawfirmName,
      lawfirmEmail: formData.lawfirmEmail,
      lawfirmContact: formData.lawfirmContact,
      lawfirmViewCount: formData.lawfirmViewCount,
      lawfirmSubcategoryId: selectedSubCategory,
      lawfirmCategoryId: selectedCategory,
      lawfirmDirects: formData.lawfirmDirects,
      lawfirmImages: formData.lawfirmImages,
    }

    // 선택적 필드는 값이 있을 때만 추가
    if (formData.lawfirmAddress?.trim()) {
      submitData.lawfirmAddress = formData.lawfirmAddress.trim()
    }
    if (formData.lawfirmGreetingTitle?.trim()) {
      submitData.lawfirmGreetingTitle = formData.lawfirmGreetingTitle.trim()
    }
    if (formData.lawfirmGreetingContent?.trim()) {
      submitData.lawfirmGreetingContent = formData.lawfirmGreetingContent.trim()
    }
    if (formData.lawfirmHomepageUrl?.trim()) {
      submitData.lawfirmHomepageUrl = formData.lawfirmHomepageUrl.trim()
    }
    if (formData.lawfirmLogoImageUrl?.trim()) {
      submitData.lawfirmLogoImageUrl = formData.lawfirmLogoImageUrl.trim()
    }
    if (formData.lawfirmBlogUrl?.trim()) {
      submitData.lawfirmBlogUrl = formData.lawfirmBlogUrl.trim()
    }

    try {
      if (isEditMode && lawfirmId) {
        // 수정 API 호출
        await updateLawfirmMutation.mutateAsync({
          lawfirmId: Number(lawfirmId),
          request: submitData,
        })
      } else {
        // 등록 API 호출
        await createLawfirmMutation.mutateAsync(submitData)
      }
    } catch (error) {
      console.error('Submit error:', error)
    }
  }

  // 수정 모드일 때 데이터 로드
  useEffect(() => {
    if (isEditMode && lawfirmData) {
      // 로컬 바로가기 링크 상태 초기화
      setLocalDirects(
        (lawfirmData.lawfirmDirects || []).map(direct => ({
          id: direct.id,
          name: direct.name,
          link: direct.link,
        }))
      )

      // 로컬 이미지 상태 초기화
      setLocalImages(
        (lawfirmData.lawfirmImages || []).map(img => ({
          id: img.id,
          imageUrl: img.imageUrl,
        }))
      )

      // Lawfirm 타입의 데이터를 LawfirmApiRequest 형식으로 변환
      const convertedDirects = (lawfirmData.lawfirmDirects || []).map(direct => ({
        name: direct.name,
        link: direct.link,
      }))
      const convertedImages = (lawfirmData.lawfirmImages || []).map(img => ({
        imageUrl: img.imageUrl,
      }))

      setFormData({
        lawfirmId: lawfirmData.lawfirmId,
        lawfirmName: lawfirmData.lawfirmName,
        lawfirmEmail: lawfirmData.lawfirmEmail,
        lawfirmContact: lawfirmData.lawfirmContact,
        lawfirmAddress: lawfirmData.lawfirmAddress || undefined,
        lawfirmGreetingTitle: lawfirmData.lawfirmGreetingTitle || undefined,
        lawfirmGreetingContent: lawfirmData.lawfirmGreetingContent || undefined,
        lawfirmHomepageUrl: lawfirmData.lawfirmHomepageUrl || undefined,
        lawfirmLogoImageUrl: lawfirmData.lawfirmLogoImageUrl || undefined,
        lawfirmBlogUrl: lawfirmData.lawfirmBlogUrl || undefined,
        lawfirmViewCount: lawfirmData.lawfirmViewCount,
        lawfirmSubcategoryId: lawfirmData.lawfirmSubcategoryId,
        lawfirmCategoryId: selectedCategory,
        lawfirmDirects: convertedDirects,
        lawfirmImages: convertedImages,
      })
      // 카테고리 설정
      if (getMainCategoryId) {
        setSelectedCategory(getMainCategoryId)
      }
      if (lawfirmData.lawfirmSubcategoryId) {
        setSelectedSubCategory(lawfirmData.lawfirmSubcategoryId)
      }
    }
  }, [isEditMode, lawfirmData, getMainCategoryId])

  // 카테고리 변경 시 서브카테고리 초기화
  const handleCategoryChange = (categoryId: number | undefined) => {
    setSelectedCategory(categoryId)
    setSelectedSubCategory(undefined) // 서브카테고리 선택 초기화
  }

  if (categoriesLoading || (isEditMode && lawfirmLoading)) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size='large' />
      </div>
    )
  }

  const onSearch = (value: string) => {
    // 검색어와 검색 타입과 함께 리스트 페이지로 이동
    if (value.trim()) {
      const searchType = (selectedItem?.key as string) || 'name'
      navigate(`${ROUTE_PATH.AD_LAWFIRM}?search=${encodeURIComponent(value)}&searchType=${searchType}`)
    } else {
      navigate(ROUTE_PATH.AD_LAWFIRM)
    }
  }

  return (
    <div>
      <SearchHeader
        menuItems={adLawfirmMenuItems}
        bordered={false}
        title={isEditMode ? '로펌 광고 수정 화면입니다.' : '로펌 광고 등록 화면입니다.'}
        selectedItem={selectedItem}
        onSelectionChange={handleSelectionChange}
        onSearch={onSearch}
      />
      <section className={styles['ad-lawfirm-edit-page']}>
        <header className={styles['ad-lawfirm-edit-page__header']}>
          <Button
            type='primary'
            onClick={handleSubmit}
            loading={createLawfirmMutation.isPending || updateLawfirmMutation.isPending}
          >
            로펌 광고 {isEditMode ? '수정하기' : '등록하기'}
          </Button>
        </header>
        <div className={styles['ad-lawfirm-edit-page__form']}>
          <div className={styles.formRow}>
            <div className={styles.labelCol}>
              <label className={styles.label}>등록 여부</label>
            </div>
            <div className={styles.inputCol}>
              <Radio.Group value={isMemberType} onChange={handleMemberTypeChange}>
                <Radio value='member'>등록</Radio>
                <Radio value='nonMember'>중지</Radio>
              </Radio.Group>
            </div>
          </div>

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
                  options={subcategories.map(sub => ({
                    value: sub.subcategoryId,
                    label: sub.subcategoryName,
                  }))}
                />
              </div>
            </div>
          </div>

          {/* 로펌 이름 */}
          <div className={styles.formRow}>
            <div className={styles.labelCol}>
              <label className={styles.label}>
                로펌 이름 <span style={{ color: 'red' }}>*</span>
              </label>
            </div>
            <div className={styles.inputCol}>
              <Input
                placeholder='로펌 이름을 입력해 주세요'
                value={formData.lawfirmName}
                onChange={e => handleInputChange('lawfirmName', e.target.value)}
                style={{ flex: 1 }}
                required
              />
            </div>
          </div>

          {/* 로펌 이메일 */}
          <div className={styles.formRow}>
            <div className={styles.labelCol}>
              <label className={styles.label}>
                로펌 이메일 <span style={{ color: 'red' }}>*</span>
              </label>
            </div>
            <div className={styles.inputCol}>
              <Input
                placeholder='이메일을 입력해 주세요 (예: lawfirm@example.com)'
                value={formData.lawfirmEmail}
                onChange={e => handleInputChange('lawfirmEmail', e.target.value)}
                style={{ width: 300 }}
                type='email'
                required
              />
            </div>
          </div>

          {/* 로펌 주소 */}
          <div className={styles.formRow}>
            <div className={styles.labelCol}>
              <label className={styles.label}>로펌 주소</label>
            </div>
            <div className={styles.inputCol}>
              <Button icon={<PlusOutlined />}>주소검색하기</Button>
              <Input
                placeholder='상세주소를 모두 입력해 주세요 (선택사항)'
                value={formData.lawfirmAddress || ''}
                onChange={e => handleInputChange('lawfirmAddress', e.target.value)}
                style={{ flex: 1 }}
              />
            </div>
          </div>

          {/* 로펌 연락처 */}
          <div className={styles.formRow}>
            <div className={styles.labelCol}>
              <label className={styles.label}>
                로펌 연락처 <span style={{ color: 'red' }}>*</span>
              </label>
            </div>
            <div className={styles.inputCol}>
              <Input
                placeholder='연락처를 입력해 주세요 (예: 02-1234-5678)'
                value={formData.lawfirmContact}
                onChange={e => handleInputChange('lawfirmContact', e.target.value)}
                style={{ width: 300 }}
                required
              />
            </div>
          </div>

          {/* 홈페이지 주소 */}
          <div className={styles.formRow}>
            <div className={styles.labelCol}>
              <label className={styles.label}>홈페이지 주소</label>
            </div>
            <div className={styles.inputCol}>
              <Input
                placeholder='홈페이지 주소를 입력해 주세요 (선택사항, 예: https://example.com)'
                value={formData.lawfirmHomepageUrl || ''}
                onChange={e => handleInputChange('lawfirmHomepageUrl', e.target.value)}
                style={{ flex: 1 }}
              />
            </div>
          </div>

          {/* 블로그 주소 */}
          <div className={styles.formRow}>
            <div className={styles.labelCol}>
              <label className={styles.label}>블로그 주소</label>
            </div>
            <div className={styles.inputCol}>
              <Input
                placeholder='블로그 주소를 입력해 주세요 (선택사항, 예: https://blog.example.com)'
                value={formData.lawfirmBlogUrl || ''}
                onChange={e => handleInputChange('lawfirmBlogUrl', e.target.value)}
                style={{ flex: 1 }}
              />
            </div>
          </div>

          {/* 로펌 인사말 제목 */}
          <div className={styles.formRow}>
            <div className={styles.labelCol}>
              <label className={styles.label}>로펌 인사말 제목</label>
            </div>
            <div className={styles.inputCol}>
              <Input
                placeholder='인사말 제목을 입력해 주세요 (선택사항)'
                value={formData.lawfirmGreetingTitle || ''}
                onChange={e => handleInputChange('lawfirmGreetingTitle', e.target.value)}
                style={{ flex: 1 }}
              />
            </div>
          </div>

          {/* 로펌 인사말 내용 */}
          <div className={`${styles.formRow} ${styles.textareaRow}`}>
            <div className={styles.labelCol}>
              <label className={styles.label}>로펌 인사말 내용</label>
            </div>
            <div className={styles.inputCol}>
              <TextArea
                placeholder='인사말 내용을 입력해 주세요 (선택사항)'
                value={formData.lawfirmGreetingContent || ''}
                onChange={e => handleInputChange('lawfirmGreetingContent', e.target.value)}
                rows={6}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* 바로가기 링크 */}
          <div className={`${styles.formRow} ${styles.linksRow}`}>
            <div className={styles.labelCol}>
              <label className={styles.label}>바로가기 링크</label>
            </div>
            <div className={styles.inputCol}>
              {localDirects.map(link => (
                <div key={link.id} className={styles.linkItem}>
                  <Input
                    placeholder='바로가기 이름을 입력해 주세요'
                    value={link.name}
                    onChange={e => handleLinkChange(link.id, 'name', e.target.value)}
                    style={{ width: 250 }}
                  />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Input
                      placeholder='바로가기 링크를 입력해 주세요'
                      value={link.link}
                      onChange={e => handleLinkChange(link.id, 'link', e.target.value)}
                      status={urlErrors[link.id] ? 'error' : ''}
                    />
                    {urlErrors[link.id] && (
                      <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px' }}>
                        {urlErrors[link.id]}
                      </div>
                    )}
                  </div>
                  <Button danger size='small' onClick={() => handleRemoveLink(link.id)}>
                    삭제
                  </Button>
                </div>
              ))}
              <Button icon={<PlusOutlined />} onClick={handleAddLink}>
                추가
              </Button>
            </div>
          </div>

          {/* 로고 등록 */}
          <div className={`${styles.formRow} ${styles.imageRow}`}>
            <div className={styles.labelCol}>
              <label className={styles.label}>로고 등록</label>
            </div>
            <div className={styles.inputCol}>
              <div className={styles.uploadArea}>
                <div>
                  <div className={styles.uploadHint}>
                    로고 등록시 주의사항
                    <br />
                    • 가로픽셀 로고는 실물 원본 형태로 적용되어야 할 로고를 등록해주세요.
                    <br />• 권장 이미지 사이즈는 500 x 500 입니다.
                  </div>
                </div>
                {formData.lawfirmLogoImageUrl ? (
                  <div className={styles.imageList}>
                    <div className={styles.imageItem}>
                      <img src={formData.lawfirmLogoImageUrl} alt='로고' />
                      <div className={styles.imageActions}>
                        <Upload
                          beforeUpload={handleLogoUpload}
                          showUploadList={false}
                          accept='image/*'
                          disabled={isUploading}
                        >
                          <Button size='small' loading={isUploading}>
                            로고 변경
                          </Button>
                        </Upload>
                        <Button size='small' danger onClick={handleLogoRemove}>
                          로고삭제
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Upload
                    beforeUpload={handleLogoUpload}
                    showUploadList={false}
                    accept='image/*'
                    disabled={isUploading}
                  >
                    <div className={styles.uploadBox}>
                      <div style={{ textAlign: 'center' }}>
                        <UploadOutlined style={{ fontSize: 24, color: '#d9d9d9' }} />
                        <div style={{ marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>로고 업로드</div>
                      </div>
                    </div>
                  </Upload>
                )}
              </div>
            </div>
          </div>

          {/* 사진 등록 */}
          <div className={`${styles.formRow} ${styles.imageRow}`}>
            <div className={styles.labelCol}>
              <label className={styles.label}>사진 등록</label>
            </div>
            <div className={styles.inputCol}>
              <div className={styles.uploadArea}>
                <div>
                  <div className={styles.uploadHint}>
                    사진 등록시 주의사항
                    <br />• 사진은 최대 20장까지 등록 가능합니다.
                    <br />• 여러 장을 한번에 선택하여 업로드할 수 있습니다.
                  </div>
                </div>
                <div className={styles.imageList}>
                  {localImages.map(image => (
                    <div key={image.id} className={styles.imageItem}>
                      <img src={image.imageUrl} alt='업로드된 이미지' />
                      <div className={styles.imageActions}>
                        <Button size='small' danger onClick={() => handleImageRemove(image.id)}>
                          사진삭제
                        </Button>
                      </div>
                    </div>
                  ))}
                  {localImages.length < 20 && (
                    <Upload
                      beforeUpload={file => {
                        handleImageUpload(file)
                        return false
                      }}
                      showUploadList={false}
                      accept='image/*'
                      disabled={isUploading}
                    >
                      <div className={styles.uploadBox}>
                        <div style={{ textAlign: 'center' }}>
                          <UploadOutlined style={{ fontSize: 24, color: '#d9d9d9' }} />
                          <div style={{ marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>사진 업로드</div>
                        </div>
                      </div>
                    </Upload>
                  )}
                </div>
                <Upload
                  beforeUpload={(_, fileList) => {
                    const remainingSlots = 20 - localImages.length
                    const filesToUpload = fileList.slice(0, remainingSlots)
                    if (filesToUpload.length > 0) {
                      handleMultipleImageUpload(filesToUpload)
                    }
                    if (fileList.length > remainingSlots) {
                      message.warning(`최대 20장까지만 등록 가능합니다. ${remainingSlots}장만 업로드됩니다.`)
                    }
                    return false
                  }}
                  showUploadList={false}
                  accept='image/*'
                  multiple
                  disabled={isUploading || localImages.length >= 20}
                >
                  <Button icon={<UploadOutlined />} loading={isUploading} disabled={localImages.length >= 20}>
                    여러 사진 한번에 등록 ({localImages.length}/20)
                  </Button>
                </Upload>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AdLawfirmEditPage
