import SearchHeader, { SearchHeaderMenuItemType } from '@/components/searchHeader/SearchHeader'
import { adminMenuItems } from '@/constants/admin'
import { useCategory } from '@/hooks/queries/useCategory'
import { useCreateLawfirm, useLawfirm, useUpdateLawfirm } from '@/hooks/queries/useLawfirm'
import { LawfirmApiRequest } from '@/types/lawfirmTypes'
import { PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Input, Radio, RadioChangeEvent, Select, Spin, message } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './adLawfirmEdit.module.scss'
import { ROUTE_PATH } from '@/routes/routePath'

const AdLawfirmEditPage = () => {
  const navigate = useNavigate()
  const { lawfirmId } = useParams<{ lawfirmId: string }>()
  const isEditMode = !!lawfirmId
  const fileInputRef = useRef<HTMLInputElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  const { data: categories, isLoading: categoriesLoading } = useCategory()
  const { data: lawfirmData, isLoading: lawfirmLoading } = useLawfirm(isEditMode ? Number(lawfirmId) : 0)

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

  const [selectedItem, setSelectedItem] = useState<SearchHeaderMenuItemType | null>(null)
  const [formData, setFormData] = useState<LawfirmApiRequest>({
    lawfirmId: 0,
    lawfirmName: '',
    lawfirmEmail: '',
    lawfirmContact: '',
    lawfirmViewCount: 0,
    lawfirmDirects: [],
    lawfirmImages: [],
  })

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
    setFormData(prev => ({
      ...prev,
      lawfirmDirects: [
        ...prev.lawfirmDirects,
        {
          id: Date.now(),
          name: '',
          link: '',
        },
      ],
    }))
  }

  const handleRemoveLink = (id: number) => {
    setFormData(prev => ({
      ...prev,
      lawfirmDirects: prev.lawfirmDirects.filter(link => link.id !== id),
    }))
  }

  const handleLinkChange = (id: number, field: 'name' | 'link', value: string) => {
    setFormData(prev => ({
      ...prev,
      lawfirmDirects: prev.lawfirmDirects.map(link => (link.id === id ? { ...link, [field]: value } : link)),
    }))
  }

  const handleLogoUpload = () => {
    logoInputRef.current?.click()
  }

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // 실제 구현에서는 파일 업로드 API를 호출하고 URL을 받아야 함
      const reader = new FileReader()
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          lawfirmLogoImageUrl: reader.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogoRemove = () => {
    setFormData(prev => ({
      ...prev,
      lawfirmLogoImageUrl: '',
    }))
  }

  const handleImageUpload = () => {
    fileInputRef.current?.click()
  }

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader()
        reader.onload = () => {
          setFormData(prev => ({
            ...prev,
            lawfirmImages: [
              ...prev.lawfirmImages,
              {
                id: Date.now() + Math.random(),
                imageUrl: reader.result as string,
              },
            ],
          }))
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleImageRemove = (id: number) => {
    setFormData(prev => ({
      ...prev,
      lawfirmImages: prev.lawfirmImages.filter(img => img.id !== id),
    }))
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

    // 선택적 필드는 빈 값일 때 제거
    const submitData: LawfirmApiRequest = {
      lawfirmId: formData.lawfirmId,
      lawfirmName: formData.lawfirmName,
      lawfirmEmail: formData.lawfirmEmail,
      lawfirmContact: formData.lawfirmContact,
      lawfirmViewCount: formData.lawfirmViewCount,
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

    // 카테고리 정보 추가
    if (selectedCategory) {
      submitData.lawfirmCategoryId = selectedCategory
    }
    if (selectedSubCategory) {
      submitData.lawfirmSubcategoryId = selectedSubCategory
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
      setFormData({
        lawfirmId: lawfirmData.lawfirmId,
        lawfirmName: lawfirmData.lawfirmName,
        lawfirmEmail: lawfirmData.lawfirmEmail,
        lawfirmContact: lawfirmData.lawfirmContact,
        lawfirmAddress: lawfirmData.lawfirmAddress || '',
        lawfirmGreetingTitle: lawfirmData.lawfirmGreetingTitle || '',
        lawfirmGreetingContent: lawfirmData.lawfirmGreetingContent || '',
        lawfirmHomepageUrl: lawfirmData.lawfirmHomepageUrl || '',
        lawfirmLogoImageUrl: lawfirmData.lawfirmLogoImageUrl || '',
        lawfirmBlogUrl: lawfirmData.lawfirmBlogUrl || '',
        lawfirmViewCount: lawfirmData.lawfirmViewCount,
        lawfirmDirects: lawfirmData.lawfirmDirects || [],
        lawfirmImages: lawfirmData.lawfirmImages || [],
      })
      // TODO: 카테고리 설정 로직 추가 필요
    }
  }, [isEditMode, lawfirmData])

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

  return (
    <div>
      <SearchHeader
        menuItems={adminMenuItems}
        bordered={false}
        title={isEditMode ? '로펌 광고 수정 화면입니다.' : '로펌 광고 등록 화면입니다.'}
        selectedItem={selectedItem}
        onSelectionChange={handleSelectionChange}
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
              {formData.lawfirmDirects.map(link => (
                <div key={link.id} className={styles.linkItem}>
                  <Input
                    placeholder='바로가기 이름을 입력해 주세요'
                    value={link.name}
                    onChange={e => handleLinkChange(link.id, 'name', e.target.value)}
                    style={{ width: 250 }}
                  />
                  <Input
                    placeholder='바로가기 링크를 입력해 주세요'
                    value={link.link}
                    onChange={e => handleLinkChange(link.id, 'link', e.target.value)}
                    style={{ flex: 1 }}
                  />
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
                    • 가로픽셀 로고는 실물 원본 형항교 적용되 아야겉을 등록해주세요.
                    <br />• 가로 회식의 사민/시아르는 500 x 500 입니다.
                  </div>
                </div>
                <input
                  ref={logoInputRef}
                  type='file'
                  style={{ display: 'none' }}
                  accept='image/*'
                  onChange={handleLogoFileChange}
                />
                {formData.lawfirmLogoImageUrl ? (
                  <div className={styles.imageList}>
                    <div className={styles.imageItem}>
                      <img src={formData.lawfirmLogoImageUrl} alt='로고' />
                      <div className={styles.imageActions}>
                        <Button size='small' onClick={handleLogoUpload}>
                          로고등록
                        </Button>
                        <Button size='small' danger onClick={handleLogoRemove}>
                          로고삭제
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={styles.uploadBox} onClick={handleLogoUpload}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 24, color: '#d9d9d9' }}>LOGO</div>
                    </div>
                  </div>
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
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type='file'
                  style={{ display: 'none' }}
                  accept='image/*'
                  multiple
                  onChange={handleImageFileChange}
                />
                <div className={styles.imageList}>
                  {formData.lawfirmImages.map(image => (
                    <div key={image.id} className={styles.imageItem}>
                      <img src={image.imageUrl} alt='업로드된 이미지' />
                      <div className={styles.imageActions}>
                        <Button size='small' danger onClick={() => handleImageRemove(image.id)}>
                          사진삭제
                        </Button>
                      </div>
                    </div>
                  ))}
                  {formData.lawfirmImages.length < 20 && (
                    <div className={styles.uploadBox} onClick={handleImageUpload}>
                      <div style={{ textAlign: 'center' }}>
                        <UploadOutlined style={{ fontSize: 24, color: '#d9d9d9' }} />
                        <div style={{ marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>사진 업로드</div>
                      </div>
                    </div>
                  )}
                </div>
                <Button icon={<UploadOutlined />} onClick={handleImageUpload}>
                  사진등록
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AdLawfirmEditPage
