import SearchHeader, { SearchHeaderMenuItemType } from '@/components/searchHeader/SearchHeader'
import { useCategory } from '@/hooks/queries/useCategory'
import { useCreateLawfirm, useLawfirm, useUpdateLawfirm } from '@/hooks/queries/useLawfirm'
import { useLawfirmForm } from '@/hooks/useLawfirmForm'
import { useLawfirmImages } from '@/hooks/useLawfirmImages'
import { useLawfirmDirectLinks } from '@/hooks/useLawfirmDirectLinks'
import { useAddressSearch } from '@/hooks/useAddressSearch'
import AddressSearchModal from '@/components/addressSearchModal/AddressSearchModal'
import { PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Input, Radio, RadioChangeEvent, Select, Spin, message, Upload } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './adLawfirmEdit.module.scss'
import { ROUTE_PATH } from '@/routes/routePath'
import { adLawfirmMenuItems } from '../adLawfirmLayout/AdLawfirmLayout'
import { AxiosError } from 'axios'
import { errorHandle } from '@/utils/errorHandle'

const AdLawfirmEditPage = () => {
  const navigate = useNavigate()
  const { lawfirmId } = useParams<{ lawfirmId: string }>()
  const isEditMode = !!lawfirmId

  // 카테고리 데이터
  const { data: categories, isLoading: categoriesLoading } = useCategory()
  const { data: lawfirmData, isLoading: lawfirmLoading } = useLawfirm(isEditMode ? Number(lawfirmId) : 0)

  // 커스텀 훅들
  const { formData, fieldErrors, setFormData, handleInputChange, validateForm, prepareSubmitData, isFormValid } = useLawfirmForm()
  const {
    localImages,
    logoImageUrl,
    isUploading,
    handleLogoUpload,
    handleLogoRemove,
    handleImageUpload,
    handleMultipleImageUpload,
    handleImageRemove,
    getImagesForSubmit,
    initializeImages,
  } = useLawfirmImages()
  const {
    localDirects,
    urlErrors,
    handleAddLink,
    handleRemoveLink,
    handleLinkChange,
    getDirectsForSubmit,
    validateDirectLinks,
    initializeLinks,
  } = useLawfirmDirectLinks()

  // 법무법인 생성 훅
  const createLawfirmMutation = useCreateLawfirm({
    onSuccess: () => {
      message.success('법무법인이 등록되었습니다.')
      navigate(ROUTE_PATH.AD_LAWFIRM)
    },
    onError: error => {
      const code = ((error as AxiosError).response?.data as { code: number }).code
      message.error(errorHandle(code))
    },
  })

  // 법무법인 수정 훅
  const updateLawfirmMutation = useUpdateLawfirm({
    onSuccess: () => {
      message.success('법무법인 정보가 수정되었습니다.')
      navigate(ROUTE_PATH.AD_LAWFIRM)
    },
    onError: error => {
      const code = ((error as AxiosError).response?.data as { code: number }).code
      message.error(errorHandle(code))
    },
  })

  const [selectedItem, setSelectedItem] = useState<SearchHeaderMenuItemType | null>({
    label: '로펌이름',
    key: 'name',
  })
  const [isMemberType, setIsMemberType] = useState<'member' | 'nonMember'>('member')
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>()
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | undefined>()

  const { isOpen, openAddressSearch, closeAddressSearch } = useAddressSearch()

  const getMainCategoryIdBySubcategoryId = (subcategoryId: number) => {
    return categories?.find(cat => cat.subcategories.some(sub => sub.subcategoryId === subcategoryId))?.categoryId
  }

  const getMainCategoryId = useMemo(() => {
    if (!lawfirmData?.lawfirmSubcategoryId) return null
    return getMainCategoryIdBySubcategoryId(lawfirmData.lawfirmSubcategoryId)
  }, [categories, lawfirmData])

  // 선택된 카테고리의 서브카테고리 필터링
  const selectedCategoryData = categories?.find(cat => cat.categoryId === selectedCategory)
  const subcategories = selectedCategoryData?.subcategories || []

  const handleSelectionChange = (item: SearchHeaderMenuItemType) => {
    setSelectedItem(item)
  }

  const handleMemberTypeChange = (e: RadioChangeEvent) => {
    setIsMemberType(e.target.value)
  }

  // 카테고리 변경 시 서브카테고리 초기화
  const handleCategoryChange = (categoryId: number | undefined) => {
    setSelectedCategory(categoryId)
    setSelectedSubCategory(undefined)
  }

  // 로고 업로드 처리
  const handleLogoUploadWrapper = async (file: File) => {
    const fileUrl = await handleLogoUpload(file)
    if (fileUrl) {
      setFormData(prev => ({
        ...prev,
        lawfirmLogoImageUrl: fileUrl,
      }))
    }
    return false
  }

  // 로고 제거 처리
  const handleLogoRemoveWrapper = () => {
    handleLogoRemove()
    setFormData(prev => ({
      ...prev,
      lawfirmLogoImageUrl: '',
    }))
  }

  // 이미지 업로드 처리
  const handleImageUploadWrapper = async (file: File) => {
    const newImage = await handleImageUpload(file)
    if (newImage) {
      setFormData(prev => ({
        ...prev,
        lawfirmImages: [...prev.lawfirmImages, { imageUrl: newImage.imageUrl }],
      }))
    }
    return false
  }

  // 다중 이미지 업로드 처리
  const handleMultipleImageUploadWrapper = async (files: File[]) => {
    const newImages = await handleMultipleImageUpload(files)
    if (newImages.length > 0) {
      setFormData(prev => ({
        ...prev,
        lawfirmImages: [...prev.lawfirmImages, ...newImages.map(img => ({ imageUrl: img.imageUrl }))],
      }))
    }
  }

  // 이미지 제거 처리
  const handleImageRemoveWrapper = (id: number) => {
    const imageToRemove = localImages.find(img => img.id === id)
    if (imageToRemove) {
      handleImageRemove(id)
      setFormData(prev => ({
        ...prev,
        lawfirmImages: prev.lawfirmImages.filter(img => img.imageUrl !== imageToRemove.imageUrl),
      }))
    }
  }

  // 링크 추가 처리
  const handleAddLinkWrapper = () => {
    handleAddLink()
    setFormData(prev => ({
      ...prev,
      lawfirmDirects: [...prev.lawfirmDirects, { name: '', link: '' }],
    }))
  }

  // 링크 제거 처리
  const handleRemoveLinkWrapper = (id: number) => {
    const indexToRemove = localDirects.findIndex(d => d.id === id)
    if (indexToRemove !== -1) {
      handleRemoveLink(id)
      setFormData(prev => ({
        ...prev,
        lawfirmDirects: prev.lawfirmDirects.filter((_, index) => index !== indexToRemove),
      }))
    }
  }

  // 링크 변경 처리
  const handleLinkChangeWrapper = (id: number, field: 'name' | 'link', value: string) => {
    handleLinkChange(id, field, value)
    const index = localDirects.findIndex(d => d.id === id)
    if (index !== -1) {
      setFormData(prev => ({
        ...prev,
        lawfirmDirects: prev.lawfirmDirects.map((link, i) => (i === index ? { ...link, [field]: value } : link)),
      }))
    }
  }

  const handleAddressComplete = (data: { address: string; zonecode: string }) => {
    handleInputChange('lawfirmAddress', data.address)
  }

  const handleSubmit = async () => {
    // 폼 유효성 검증
    if (!validateForm(localDirects, selectedSubCategory)) return

    // 실시간 유효성 검증 에러 체크
    if (Object.keys(fieldErrors).length > 0) {
      message.warning('입력값에 오류가 있습니다. 확인 후 다시 시도해주세요.')
      return
    }

    // 바로가기 링크 유효성 검증
    if (!validateDirectLinks()) return

    // 제출 데이터 준비
    const submitData = prepareSubmitData(selectedCategory, selectedSubCategory)

    // 이미지와 바로가기 링크 데이터 추가
    submitData.lawfirmImages = getImagesForSubmit()
    submitData.lawfirmDirects = getDirectsForSubmit()
    if (logoImageUrl) {
      submitData.lawfirmLogoImageUrl = logoImageUrl
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
      // 폼 데이터 설정
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
        lawfirmDirects: (lawfirmData.lawfirmDirects || []).map(direct => ({
          name: direct.name,
          link: direct.link,
        })),
        lawfirmImages: (lawfirmData.lawfirmImages || []).map(img => ({
          imageUrl: img.imageUrl,
        })),
      })

      // 이미지 데이터 초기화
      initializeImages(
        (lawfirmData.lawfirmImages || []).map(img => ({
          id: img.id,
          imageUrl: img.imageUrl,
        })),
        lawfirmData.lawfirmLogoImageUrl || undefined
      )

      // 바로가기 링크 데이터 초기화
      initializeLinks(
        (lawfirmData.lawfirmDirects || []).map(direct => ({
          id: direct.id,
          name: direct.name,
          link: direct.link,
        }))
      )

      // 카테고리 설정
      if (getMainCategoryId) {
        setSelectedCategory(getMainCategoryId)
      }
      if (lawfirmData.lawfirmSubcategoryId) {
        setSelectedSubCategory(lawfirmData.lawfirmSubcategoryId)
      }
    }
  }, [isEditMode, lawfirmData, getMainCategoryId, setFormData, initializeImages, initializeLinks])

  if (categoriesLoading || (isEditMode && lawfirmLoading)) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size='large' />
      </div>
    )
  }

  const onSearch = (value: string) => {
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
            disabled={!isFormValid() || Object.keys(urlErrors).length > 0 || !selectedSubCategory}
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
              <label className={styles.label}>
                분류 선택 <span style={{ color: 'red' }}>*</span>
              </label>
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
                status={fieldErrors.lawfirmEmail ? 'error' : ''}
              />
              {fieldErrors.lawfirmEmail && (
                <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px', marginLeft: '8px' }}>
                  {fieldErrors.lawfirmEmail}
                </div>
              )}
            </div>
          </div>

          {/* 로펌 주소 */}
          <div className={styles.formRow}>
            <div className={styles.labelCol}>
              <label className={styles.label}>로펌 주소</label>
            </div>
            <div className={styles.inputCol}>
              <Button icon={<PlusOutlined />} onClick={openAddressSearch}>
                주소검색하기
              </Button>
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
                status={fieldErrors.lawfirmContact ? 'error' : ''}
              />
              {fieldErrors.lawfirmContact && (
                <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px', marginLeft: '8px' }}>
                  {fieldErrors.lawfirmContact}
                </div>
              )}
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
                status={fieldErrors.lawfirmHomepageUrl ? 'error' : ''}
              />
              {fieldErrors.lawfirmHomepageUrl && (
                <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px', marginLeft: '8px' }}>
                  {fieldErrors.lawfirmHomepageUrl}
                </div>
              )}
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
                status={fieldErrors.lawfirmBlogUrl ? 'error' : ''}
              />
              {fieldErrors.lawfirmBlogUrl && (
                <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px', marginLeft: '8px' }}>
                  {fieldErrors.lawfirmBlogUrl}
                </div>
              )}
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
                <>
                  <div key={link.id} className={styles.linkItem}>
                    <Input
                      placeholder='바로가기 이름을 입력해 주세요'
                      value={link.name}
                      onChange={e => handleLinkChangeWrapper(link.id, 'name', e.target.value)}
                      style={{ width: 250 }}
                    />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <Input
                        placeholder='바로가기 링크를 입력해 주세요'
                        value={link.link}
                        onChange={e => handleLinkChangeWrapper(link.id, 'link', e.target.value)}
                        status={urlErrors[link.id] ? 'error' : ''}
                      />
                    </div>
                    <Button danger size='small' onClick={() => handleRemoveLinkWrapper(link.id)}>
                      삭제
                    </Button>
                  </div>
                  {urlErrors[link.id] && (
                    <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px' }}>{urlErrors[link.id]}</div>
                  )}
                </>
              ))}

              <Button icon={<PlusOutlined />} onClick={handleAddLinkWrapper}>
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
                {logoImageUrl ? (
                  <div className={styles.imageList}>
                    <div className={styles.imageItem}>
                      <img src={logoImageUrl} alt='로고' />
                      <div className={styles.imageActions}>
                        <Upload
                          beforeUpload={handleLogoUploadWrapper}
                          showUploadList={false}
                          accept='image/*'
                          disabled={isUploading}
                        >
                          <Button size='small' loading={isUploading}>
                            로고 변경
                          </Button>
                        </Upload>
                        <Button size='small' danger onClick={handleLogoRemoveWrapper}>
                          로고삭제
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Upload
                    beforeUpload={handleLogoUploadWrapper}
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
                        <Button size='small' danger onClick={() => handleImageRemoveWrapper(image.id)}>
                          사진삭제
                        </Button>
                      </div>
                    </div>
                  ))}
                  {localImages.length < 20 && (
                    <Upload
                      beforeUpload={file => {
                        handleImageUploadWrapper(file)
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
                      handleMultipleImageUploadWrapper(filesToUpload)
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

      <AddressSearchModal isOpen={isOpen} onClose={closeAddressSearch} onComplete={handleAddressComplete} />
    </div>
  )
}

export default AdLawfirmEditPage
