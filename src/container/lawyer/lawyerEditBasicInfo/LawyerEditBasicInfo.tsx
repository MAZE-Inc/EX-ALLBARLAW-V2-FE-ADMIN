import { useState, useImperativeHandle, forwardRef, useEffect } from 'react'
import { Input, Select, Upload, Button, Radio, message } from 'antd'
import { PlusOutlined, DeleteOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { useFileUpload } from '@/hooks/useFileUpload'
import styles from './lawyerEditBasicInfo.module.scss'
import { useLawyerBasicInfo } from '@/hooks/queries/useLawyer'
import { useCategory } from '@/hooks/queries/useCategory'

const { TextArea } = Input

interface ProfileImage {
  url: string // 이미지 URL (서버에서 받은 URL)
  isExisting?: boolean // 기존 이미지인지 새로 업로드한 이미지인지 구분
  originalDisplayOrder?: number // 서버에서 받은 원래 displayOrder
  imageId?: number // 서버에서 받은 이미지 ID
}

export interface LawyerEditBasicInfoRef {
  uploadImages: () => Promise<string[]> // 업로드된 이미지 URL 배열 반환
  getFormData: () => any // 폼 데이터 반환
  getImageData: () => Array<{ imageUrl: string; displayOrder: number; imageId?: number }> // 구조화된 이미지 데이터 반환
  validateForm: () => boolean // 폼 유효성 검사
}

const LawyerEditBasicInfo = forwardRef<LawyerEditBasicInfoRef, { lawyerId: string | undefined }>((props, ref) => {
  const { lawyerId } = props
  const [profileImages, setProfileImages] = useState<(ProfileImage | null)[]>([null, null, null, null, null])
  const { uploadFile } = useFileUpload()
  const [isDataInitialized, setIsDataInitialized] = useState(false)

  const { data: lawyerBasicInfo } = useLawyerBasicInfo(Number(lawyerId))
  const { data: categoryList } = useCategory()

  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    greeting: '',
    lawyerName: '',
    birthYear: undefined as number | undefined,
    birthMonth: undefined as number | undefined,
    birthDay: undefined as number | undefined,
    gender: '',
    phoneNumber: '',
    tags: '',
    lawfirmName: '',
    address: '',
    addressDetail: '',
    officePhone: '',
    categories: [] as { categoryId: number; subcategoryId: number | null }[],
  })

  // 에러 상태
  const [errors, setErrors] = useState<Record<string, string>>({})

  // 유효성 검사 함수
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // 필수 필드 검사
    if (!formData.greeting.trim()) {
      newErrors.greeting = '인사말을 입력해주세요.'
    }

    if (!formData.lawyerName.trim()) {
      newErrors.lawyerName = '변호사 이름을 입력해주세요.'
    }

    if (!formData.birthYear) {
      newErrors.birthYear = '생년을 선택해주세요.'
    }

    if (!formData.birthMonth) {
      newErrors.birthMonth = '생월을 선택해주세요.'
    }

    if (!formData.birthDay) {
      newErrors.birthDay = '생일을 선택해주세요.'
    }

    if (!formData.gender) {
      newErrors.gender = '성별을 선택해주세요.'
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = '휴대폰 번호를 입력해주세요.'
    } else if (!/^010-?\d{3,4}-?\d{4}$/.test(formData.phoneNumber.replace(/-/g, ''))) {
      newErrors.phoneNumber = '올바른 휴대폰 번호 형식이 아닙니다.'
    }

    // 태그 검사 (최소 2개, 최대 4개)
    const tagArray = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    if (tagArray.length < 2) {
      newErrors.tags = '최소 2개 이상의 태그를 입력해주세요.'
    } else if (tagArray.length > 4) {
      newErrors.tags = '태그는 최대 4개까지 입력 가능합니다.'
    }

    if (!formData.lawfirmName.trim()) {
      newErrors.lawfirmName = '로펌 사무실 이름을 입력해주세요.'
    }

    if (!formData.address.trim()) {
      newErrors.address = '사무실 주소를 입력해주세요.'
    }

    if (!formData.addressDetail.trim()) {
      newErrors.addressDetail = '상세주소를 입력해주세요.'
    }

    if (!formData.officePhone.trim()) {
      newErrors.officePhone = '사무실 연락처를 입력해주세요.'
    }

    // 카테고리 검사 (최소 1개 이상)
    const validCategories = formData.categories.filter(cat => cat.subcategoryId !== null)
    if (validCategories.length === 0) {
      newErrors.categories = '최소 1개 이상의 주요분야를 선택해주세요.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 데이터 로드 시 폼 필드 초기화
  useEffect(() => {
    if (lawyerBasicInfo && categoryList && !isDataInitialized) {
      // subcategory ID로 해당하는 category ID 찾기
      const mappedCategories =
        lawyerBasicInfo.lawyerSubcategories?.map((sub: any) => {
          // categoryList에서 해당 subcategory를 포함하는 category 찾기
          const parentCategory = categoryList.find(cat =>
            cat.subcategories.some(s => s.subcategoryId === sub.subcategoryId)
          )

          return {
            categoryId: parentCategory?.categoryId || 0,
            subcategoryId: sub.subcategoryId || null,
          }
        }) || []

      setFormData({
        greeting: lawyerBasicInfo.lawyerDescription || '',
        lawyerName: lawyerBasicInfo.lawyerName || '',
        birthYear: lawyerBasicInfo.lawyerBirthYear || undefined,
        birthMonth: lawyerBasicInfo.lawyerBirthMonth || undefined,
        birthDay: lawyerBasicInfo.lawyerBirthDay || undefined,
        gender: lawyerBasicInfo.lawyerGender === 0 ? 'M' : 'F',
        phoneNumber: lawyerBasicInfo.lawyerPhone || '',
        tags: lawyerBasicInfo.lawyerTags?.map(tag => (typeof tag === 'string' ? tag : tag.tagName)).join(', ') || '',
        lawfirmName: lawyerBasicInfo.lawyerLawfirmName || '',
        address: lawyerBasicInfo.lawyerLawfirmAddress || '',
        addressDetail: lawyerBasicInfo.lawyerLawfirmAddressDetail || '',
        officePhone: lawyerBasicInfo.lawyerLawfirmContact || '',
        categories: mappedCategories,
      })

      // 이미지 데이터 설정
      if (lawyerBasicInfo.lawyerProfileImages && lawyerBasicInfo.lawyerProfileImages.length > 0) {
        const images: (ProfileImage | null)[] = [null, null, null, null, null]
        lawyerBasicInfo.lawyerProfileImages.forEach((img: any, index: number) => {
          if (index < 5) {
            images[index] = {
              url: img.imageUrl, // imageUrl 필드 사용
              isExisting: true,
              originalDisplayOrder: img.displayOrder, // 원래 displayOrder 저장
              imageId: img.id, // 이미지 ID 저장
            }
          }
        })
        setProfileImages(images)
      }

      setIsDataInitialized(true)
    }
  }, [lawyerBasicInfo, categoryList, isDataInitialized])

  const handleImageDelete = (index: number) => {
    const newImages = [...profileImages]
    // 삭제할 이미지 제거
    newImages.splice(index, 1)
    // 마지막에 null 추가하여 5개 유지
    newImages.push(null)
    setProfileImages(newImages)
    message.success('이미지가 삭제되었습니다.')
  }

  // 이미지 URL 배열 반환 함수 (최종 저장 시 호출)
  const uploadImages = async (): Promise<string[]> => {
    // 이미 업로드된 이미지 URL들을 그대로 반환
    return profileImages.filter(img => img !== null).map(img => img!.url)
  }

  // 구조화된 이미지 데이터 반환 함수
  const getImageData = () => {
    return profileImages
      .filter(img => img !== null)
      .map((img, index) => {
        if (img!.isExisting && img!.originalDisplayOrder) {
          // 기존 이미지는 원래 displayOrder 유지
          return {
            imageUrl: img!.url,
            displayOrder: img!.originalDisplayOrder,
            imageId: img!.imageId,
          }
        } else {
          // 새로 추가된 이미지는 현재 위치 기준으로 displayOrder 설정
          return {
            imageUrl: img!.url,
            displayOrder: index + 1,
          }
        }
      })
  }

  // 폼 데이터 반환 함수
  const getFormData = () => {
    return {
      ...formData,
      tags: formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0),
    }
  }

  // 입력 핸들러
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // 입력 시 해당 필드의 에러 메시지 제거
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // 카테고리 추가
  const handleAddCategory = () => {
    if (formData.categories.length >= 20) {
      message.warning('최대 20개까지만 추가할 수 있습니다.')
      return
    }
    setFormData(prev => ({
      ...prev,
      categories: [...prev.categories, { categoryId: 0, subcategoryId: null }],
    }))
  }

  // 카테고리 삭제
  const handleRemoveCategory = (index: number) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index),
    }))
  }

  // 카테고리 변경
  const handleCategoryChange = (index: number, field: 'categoryId' | 'subcategoryId', value: number | null) => {
    setFormData(prev => {
      const newCategories = [...prev.categories]
      if (field === 'categoryId') {
        newCategories[index] = { categoryId: value as number, subcategoryId: null }
      } else {
        newCategories[index] = { ...newCategories[index], subcategoryId: value }
      }
      return { ...prev, categories: newCategories }
    })
    // 카테고리 변경 시 에러 메시지 제거
    if (errors.categories) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.categories
        return newErrors
      })
    }
  }

  // ref를 통해 부모 컴포넌트에서 호출 가능한 함수들 노출
  useImperativeHandle(ref, () => ({
    uploadImages,
    getFormData,
    getImageData,
    validateForm,
  }))

  return (
    <div className={styles['lawyer-edit-basic-info']}>
      <div className={styles.formSection}>
        {/* 프로필 사진 등록 */}
        <div className={styles.formRow}>
          <div className={styles.labelCol}>
            <label className={styles.label}>프로필 사진 등록</label>
          </div>
          <div className={styles.inputCol}>
            <div className={styles.notice}>
              <p>※ 사진등록시 주의사항</p>
              <ul>
                <li>의뢰인에게 신뢰를 얻을 수 있는 사진을 등록해주세요</li>
                <li>가급적 단독 사진의 상체위주로 촬영후 등록해주시고, 전체 샷은 오히려 잘 안보일 수 있습니다.</li>
                <li>가장 최적의 사진 사이즈는 1,200 x 400이며, 최대 5장까지 등록 가능합니다.</li>
              </ul>
            </div>
            <div className={styles.imageUploadArea}>
              {profileImages.map((file, index) => {
                // 이전 슬롯이 채워졌는지 확인 (첫 번째 슬롯은 항상 활성화)
                const isPreviousFilled = index === 0 || profileImages[index - 1] !== null
                // 현재 슬롯이 활성화되어야 하는지 확인
                const isEnabled = isPreviousFilled && !file

                return (
                  <div key={index} className={styles.imageSlot}>
                    {file ? (
                      <>
                        <img src={file.url} alt={`profile-${index}`} />
                        <DeleteOutlined className={styles.deleteIcon} onClick={() => handleImageDelete(index)} />
                      </>
                    ) : (
                      <Upload
                        accept='image/jpeg,image/png,image/webp'
                        showUploadList={false}
                        disabled={!isEnabled}
                        beforeUpload={async file => {
                          try {
                            // 서버에 이미지 업로드
                            const result = await uploadFile(file, {
                              folder: `lawyer/profile/${lawyerId}`,
                              maxSize: 5,
                              allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
                            })

                            // 업로드 성공 시 URL 저장
                            const newImages = [...profileImages]
                            newImages[index] = {
                              url: result.fileUrl,
                              isExisting: false,
                            }
                            setProfileImages(newImages)
                            message.success('이미지가 업로드되었습니다.')
                          } catch (error) {
                            message.error(
                              `이미지 업로드 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
                            )
                          }
                          return false // 자동 업로드 방지
                        }}
                      >
                        <div className={`${styles.uploadPlaceholder} ${!isEnabled ? styles.disabled : ''}`}>
                          <PlusOutlined />
                          <div>사진등록</div>
                        </div>
                      </Upload>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* 인사말 */}
        <div className={styles.formRow}>
          <div className={styles.labelCol}>
            <label className={styles.label}>인사말</label>
          </div>
          <div className={styles.inputCol}>
            <div style={{ width: '100%' }}>
              <TextArea
                rows={4}
                placeholder='의뢰인에게 보여줄 인사말을 최대 200자 이내로 입력해주세요.'
                maxLength={200}
                value={formData.greeting}
                onChange={e => handleInputChange('greeting', e.target.value)}
                style={{ resize: 'none', borderColor: errors.greeting ? '#ff4d4f' : undefined }}
                status={errors.greeting ? 'error' : undefined}
              />
              {errors.greeting && (
                <div style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '4px' }}>{errors.greeting}</div>
              )}
            </div>
          </div>
        </div>

        {/* 변호사 이름 */}
        <div className={styles.formRow}>
          <div className={styles.labelCol}>
            <label className={styles.label}>변호사 이름</label>
          </div>
          <div className={styles.inputCol}>
            <div style={{ width: '100%' }}>
              <Input
                placeholder='이름을 입력해주세요'
                value={formData.lawyerName}
                onChange={e => handleInputChange('lawyerName', e.target.value)}
                status={errors.lawyerName ? 'error' : undefined}
              />
              {errors.lawyerName && (
                <div style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '4px' }}>{errors.lawyerName}</div>
              )}
            </div>
          </div>
        </div>

        {/* 생년월일/성별 */}
        <div className={styles.formRow}>
          <div className={styles.labelCol}>
            <label className={styles.label}>생년월일/성별</label>
          </div>
          <div className={styles.inputCol}>
            <div style={{ width: '100%' }}>
              <div className={styles.flexRow}>
                <Select
                  placeholder='년도'
                  style={{ width: 100 }}
                  value={formData.birthYear}
                  onChange={value => handleInputChange('birthYear', value)}
                  status={errors.birthYear ? 'error' : undefined}
                >
                  {Array.from({ length: 50 }, (_, i) => 2024 - i).map(year => (
                    <Select.Option key={year} value={year}>
                      {year}
                    </Select.Option>
                  ))}
                </Select>
                <Select
                  placeholder='월'
                  style={{ width: 80 }}
                  value={formData.birthMonth}
                  onChange={value => handleInputChange('birthMonth', value)}
                  status={errors.birthMonth ? 'error' : undefined}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <Select.Option key={month} value={month}>
                      {month}
                    </Select.Option>
                  ))}
                </Select>
                <Select
                  placeholder='일'
                  style={{ width: 80 }}
                  value={formData.birthDay}
                  onChange={value => handleInputChange('birthDay', value)}
                  status={errors.birthDay ? 'error' : undefined}
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <Select.Option key={day} value={day}>
                      {day}
                    </Select.Option>
                  ))}
                </Select>
                <Radio.Group value={formData.gender} onChange={e => handleInputChange('gender', e.target.value)}>
                  <Radio value='M'>남자</Radio>
                  <Radio value='F'>여자</Radio>
                </Radio.Group>
              </div>
              {(errors.birthYear || errors.birthMonth || errors.birthDay || errors.gender) && (
                <div style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '4px' }}>
                  {errors.birthYear || errors.birthMonth || errors.birthDay || errors.gender}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 휴대폰 번호 */}
        <div className={styles.formRow}>
          <div className={styles.labelCol}>
            <label className={styles.label}>휴대폰 번호</label>
          </div>
          <div className={styles.inputCol}>
            <div style={{ width: '100%' }}>
              <Input
                placeholder='휴대폰 번호를 입력해주세요'
                value={formData.phoneNumber}
                onChange={e => handleInputChange('phoneNumber', e.target.value)}
                status={errors.phoneNumber ? 'error' : undefined}
              />
              {errors.phoneNumber && (
                <div style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '4px' }}>{errors.phoneNumber}</div>
              )}
            </div>
          </div>
        </div>

        {/* 검찰 태그 */}
        <div className={styles.formRow}>
          <div className={styles.labelCol}>
            <label className={styles.label}>
              관련 태그
              <br />
              (최소2개 / 최대 4개)
            </label>
          </div>
          <div className={styles.inputCol}>
            <div style={{ width: '100%' }}>
              <Input
                placeholder='자신있는 분야, 관련 키워드를 입력해주세요. 검색에 노출됩니다 (콤마로 구분)'
                value={formData.tags}
                onChange={e => handleInputChange('tags', e.target.value)}
                status={errors.tags ? 'error' : undefined}
              />
              {errors.tags && <div style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '4px' }}>{errors.tags}</div>}
              <div className={styles.tagList} style={{ marginTop: 8 }}>
                <span className={styles.link}>2개이상의 태그를 입력해주세요. 콤마를 이용하여 구분할 수 있습니다.</span>
              </div>
            </div>
          </div>
        </div>

        {/* 로펌 사무실 이름 */}
        <div className={styles.formRow}>
          <div className={styles.labelCol}>
            <label className={styles.label}>로펌 사무실 이름</label>
          </div>
          <div className={styles.inputCol}>
            <div style={{ width: '100%' }}>
              <Input
                placeholder='사무실명을 입력해주세요'
                value={formData.lawfirmName}
                onChange={e => handleInputChange('lawfirmName', e.target.value)}
                status={errors.lawfirmName ? 'error' : undefined}
              />
              {errors.lawfirmName && (
                <div style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '4px' }}>{errors.lawfirmName}</div>
              )}
            </div>
          </div>
        </div>

        {/* 사무실 주소 */}
        <div className={styles.formRow}>
          <div className={styles.labelCol}>
            <label className={styles.label}>사무실 주소</label>
          </div>
          <div className={styles.inputCol}>
            <div style={{ width: '100%' }}>
              <div className={styles.flexRow}>
                <Button>주소 검색하기</Button>
                <Input
                  placeholder='신주소 입력'
                  style={{ flex: 1, marginLeft: 8 }}
                  value={formData.address}
                  onChange={e => handleInputChange('address', e.target.value)}
                  status={errors.address ? 'error' : undefined}
                />
              </div>
              {errors.address && (
                <div style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '4px' }}>{errors.address}</div>
              )}
              <Input
                placeholder='상세주소를 모두 입력해 주세요'
                style={{ marginTop: 8 }}
                value={formData.addressDetail}
                onChange={e => handleInputChange('addressDetail', e.target.value)}
                status={errors.addressDetail ? 'error' : undefined}
              />
              {errors.addressDetail && (
                <div style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '4px' }}>{errors.addressDetail}</div>
              )}
              <div style={{ marginTop: 8 }}>
                <span className={styles.link}>주소 등록</span>
                <span className={styles.helperText}>가능합니다.</span>
              </div>
            </div>
          </div>
        </div>

        {/* 사무실 연락처 */}
        <div className={styles.formRow}>
          <div className={styles.labelCol}>
            <label className={styles.label}>사무실 연락처</label>
          </div>
          <div className={styles.inputCol}>
            <div style={{ width: '100%' }}>
              <Input
                placeholder='사무실 번호를 입력해주세요'
                value={formData.officePhone}
                onChange={e => handleInputChange('officePhone', e.target.value)}
                status={errors.officePhone ? 'error' : undefined}
              />
              {errors.officePhone && (
                <div style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '4px' }}>{errors.officePhone}</div>
              )}
              <div className={styles.flexRow} style={{ marginTop: 8 }}>
                <span className={styles.link}>사무실 번호 등록이</span>
                <span className={styles.helperText}>가능합니다.</span>
              </div>
            </div>
          </div>
        </div>

        {/* 주요분야 선택 */}
        <div className={styles.formRow}>
          <div className={styles.labelCol}>
            <label className={styles.label}>
              주요분야 선택
              <br />
              (최소 1개 / 최대 20개)
            </label>
          </div>
          <div className={styles.inputCol}>
            <div style={{ width: '100%' }}>
              <div className={styles.categoryList}>
                {formData.categories.map((category, index) => {
                  const selectedCategory = categoryList?.find(c => c.categoryId === category.categoryId)
                  return (
                    <div key={index} className={styles.categoryItem}>
                      <Select
                        placeholder='대분류 선택'
                        value={category.categoryId || undefined}
                        onChange={value => handleCategoryChange(index, 'categoryId', value)}
                        style={{ width: 180 }}
                      >
                        {categoryList?.map(cat => (
                          <Select.Option key={cat.categoryId} value={cat.categoryId}>
                            {cat.categoryName}
                          </Select.Option>
                        ))}
                      </Select>
                      <Select
                        placeholder='소분류 선택'
                        value={category.subcategoryId || undefined}
                        onChange={value => handleCategoryChange(index, 'subcategoryId', value)}
                        disabled={!category.categoryId}
                        style={{ width: 180 }}
                      >
                        {selectedCategory?.subcategories?.map(sub => (
                          <Select.Option key={sub.subcategoryId} value={sub.subcategoryId}>
                            {sub.subcategoryName}
                          </Select.Option>
                        ))}
                      </Select>
                      <Button
                        type='text'
                        danger
                        icon={<MinusCircleOutlined />}
                        onClick={() => handleRemoveCategory(index)}
                      />
                    </div>
                  )
                })}
                {formData.categories.length < 20 && (
                  <Button type='dashed' icon={<PlusOutlined />} onClick={handleAddCategory} style={{ width: '100%' }}>
                    분야 추가
                  </Button>
                )}
              </div>
              {errors.categories && (
                <div style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '4px' }}>{errors.categories}</div>
              )}
              <div style={{ marginTop: 8 }}>
                <span className={styles.link}>최소 1개 이상의 주요분야를 선택해주세요.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

LawyerEditBasicInfo.displayName = 'LawyerEditBasicInfo'

export default LawyerEditBasicInfo
