import { Input, Space, Radio } from 'antd'
import styles from './admin-form.module.scss'
import { ADMIN_PERMISSION_IDS } from '@/constants/adminPermission'

interface AdminFormProps {
  formData: {
    accountType: '1' | '2'
    account: string
    email: string
    name: string
    password: string
    passwordConfirm: string
    isActive: boolean
    subMenuIds: number[]
  }
  onChange: (data: {
    accountType: '1' | '2'
    account: string
    email: string
    name: string
    password: string
    passwordConfirm: string
    isActive: boolean
    subMenuIds: number[]
  }) => void
  isEditMode?: boolean
}

const AdminForm = ({ formData, onChange }: AdminFormProps) => {
  const handleChange = (field: string, value: any) => {
    onChange({
      ...formData,
      [field]: value,
    })
  }

  const handlePermissionChange = (permissionId: number, checked: boolean) => {
    const newPermissions = checked
      ? [...formData.subMenuIds, permissionId]
      : formData.subMenuIds.filter(id => id !== permissionId)

    onChange({
      ...formData,
      subMenuIds: newPermissions,
    })
  }

  return (
    <div className={styles.adminFormPage}>
      <h3 className={styles.permissionTitle}>
        <span className={styles.icon}>♦</span>
        계정정보 입력
      </h3>

      <section className={styles.adminFormPage__form}>
        <div className={styles.formRow}>
          <div className={styles.labelCol}>
            <label className={styles.label}>계정구분</label>
          </div>
          <div className={styles.inputCol}>
            <Radio.Group
              value={formData.accountType}
              onChange={e => handleChange('accountType', e.target.value)}
              className={styles.radioGroup}
            >
              <Space size='large' className={styles.radioContainer}>
                <Radio value='1'>통합관리자</Radio>
                <Radio value='2'>CS관리자</Radio>
              </Space>
            </Radio.Group>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.labelCol}>
            <label className={styles.label}>아이디</label>
          </div>
          <div className={styles.inputCol}>
            <Input
              placeholder='아이디를 입력하세요'
              value={formData.account}
              onChange={e => handleChange('account', e.target.value)}
              size='large'
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.labelCol}>
            <label className={styles.label}>이메일 주소</label>
          </div>
          <div className={styles.inputCol}>
            <Input
              placeholder='이메일을 입력하세요'
              value={formData.email}
              onChange={e => handleChange('email', e.target.value)}
              size='large'
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.labelCol}>
            <label className={styles.label}>계정이름</label>
          </div>
          <div className={styles.inputCol}>
            <Input
              placeholder='계정이름을 입력하세요'
              value={formData.name}
              onChange={e => handleChange('name', e.target.value)}
              size='large'
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.labelCol}>
            <label className={styles.label}>비밀번호</label>
          </div>
          <div className={styles.inputCol}>
            <Input.Password
              placeholder='비밀번호를 입력하세요'
              value={formData.password}
              onChange={e => handleChange('password', e.target.value)}
              size='large'
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.labelCol}>
            <label className={styles.label}>비밀번호 확인</label>
          </div>
          <div className={styles.inputCol}>
            <Input.Password
              placeholder='비밀번호를 다시 입력하세요'
              value={formData.passwordConfirm}
              onChange={e => handleChange('passwordConfirm', e.target.value)}
              size='large'
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.labelCol}>
            <label className={styles.label}>계정사용 여부</label>
          </div>
          <div className={styles.inputCol}>
            <Radio.Group
              value={formData.isActive}
              onChange={e => handleChange('isActive', e.target.value)}
              className={styles.radioGroup}
            >
              <Space size='large' className={styles.radioContainer}>
                <Radio value={true}>사용</Radio>
                <Radio value={false}>중지</Radio>
              </Space>
            </Radio.Group>
          </div>
        </div>
      </section>

      <section className={styles.adminFormPage__permissionForm}>
        <h3 className={styles.permissionTitle}>
          <span className={styles.icon}>♦</span>
          계정 메뉴권한 설정
        </h3>

        <div className={styles.permissionGrid}>
          <div className={styles.permissionColumn}>
            <div className={styles.permissionSection}>
              <div className={styles.sectionHeader}>관리자 계정</div>
              <div className={styles.permissionItem}>
                <input
                  type='checkbox'
                  id='admin-list'
                  className={styles.checkbox}
                  checked={formData.subMenuIds.includes(ADMIN_PERMISSION_IDS.ADMIN_ACCOUNT_LIST)}
                  onChange={e => handlePermissionChange(ADMIN_PERMISSION_IDS.ADMIN_ACCOUNT_LIST, e.target.checked)}
                />
                <label htmlFor='admin-list'>관리자 계정 목록</label>
              </div>
              <div className={styles.permissionItem}>
                <input
                  type='checkbox'
                  id='admin-register'
                  className={styles.checkbox}
                  checked={formData.subMenuIds.includes(ADMIN_PERMISSION_IDS.ACCOUNT_REGISTER)}
                  onChange={e => handlePermissionChange(ADMIN_PERMISSION_IDS.ACCOUNT_REGISTER, e.target.checked)}
                />
                <label htmlFor='admin-register'>계정 등록</label>
              </div>
            </div>

            <div className={styles.permissionSection}>
              <div className={styles.sectionHeader}>분류 설정</div>
              <div className={styles.permissionItem}>
                <input
                  type='checkbox'
                  id='category-management'
                  className={styles.checkbox}
                  checked={formData.subMenuIds.includes(ADMIN_PERMISSION_IDS.CATEGORY_MANAGEMENT)}
                  onChange={e => handlePermissionChange(ADMIN_PERMISSION_IDS.CATEGORY_MANAGEMENT, e.target.checked)}
                />
                <label htmlFor='category-management'>대/소분류 관리</label>
              </div>
            </div>

            <div className={styles.permissionSection}>
              <div className={styles.sectionHeader}>회원관리</div>
              <div className={styles.permissionItem}>
                <input
                  type='checkbox'
                  id='member-general'
                  className={styles.checkbox}
                  checked={formData.subMenuIds.includes(ADMIN_PERMISSION_IDS.MEMBER_GENERAL)}
                  onChange={e => handlePermissionChange(ADMIN_PERMISSION_IDS.MEMBER_GENERAL, e.target.checked)}
                />
                <label htmlFor='member-general'>일반 회원</label>
              </div>
              <div className={styles.permissionItem}>
                <input
                  type='checkbox'
                  id='member-lawyer'
                  className={styles.checkbox}
                  checked={formData.subMenuIds.includes(ADMIN_PERMISSION_IDS.MEMBER_LAWYER)}
                  onChange={e => handlePermissionChange(ADMIN_PERMISSION_IDS.MEMBER_LAWYER, e.target.checked)}
                />
                <label htmlFor='member-lawyer'>변호사 회원</label>
              </div>
            </div>

            <div className={styles.permissionSection}>
              <div className={styles.sectionHeader}>변호사 관리</div>
              <div className={styles.permissionItem}>
                <input
                  type='checkbox'
                  id='lawyer-list'
                  className={styles.checkbox}
                  checked={formData.subMenuIds.includes(ADMIN_PERMISSION_IDS.LAWYER_LIST)}
                  onChange={e => handlePermissionChange(ADMIN_PERMISSION_IDS.LAWYER_LIST, e.target.checked)}
                />
                <label htmlFor='lawyer-list'>변호사 리스트</label>
              </div>
            </div>

            <div className={styles.permissionSection}>
              <div className={styles.sectionHeader}>분류별 컨텐츠 관리</div>
              <div className={styles.permissionItem}>
                <input
                  type='checkbox'
                  id='content-blog'
                  className={styles.checkbox}
                  checked={formData.subMenuIds.includes(ADMIN_PERMISSION_IDS.CONTENT_BLOG)}
                  onChange={e => handlePermissionChange(ADMIN_PERMISSION_IDS.CONTENT_BLOG, e.target.checked)}
                />
                <label htmlFor='content-blog'>법률정보 글</label>
              </div>
              <div className={styles.permissionItem}>
                <input
                  type='checkbox'
                  id='content-video'
                  className={styles.checkbox}
                  checked={formData.subMenuIds.includes(ADMIN_PERMISSION_IDS.CONTENT_VIDEO)}
                  onChange={e => handlePermissionChange(ADMIN_PERMISSION_IDS.CONTENT_VIDEO, e.target.checked)}
                />
                <label htmlFor='content-video'>변호사의 영상</label>
              </div>
              <div className={styles.permissionItem}>
                <input
                  type='checkbox'
                  id='content-knowledge'
                  className={styles.checkbox}
                  checked={formData.subMenuIds.includes(ADMIN_PERMISSION_IDS.CONTENT_KNOWLEDGE)}
                  onChange={e => handlePermissionChange(ADMIN_PERMISSION_IDS.CONTENT_KNOWLEDGE, e.target.checked)}
                />
                <label htmlFor='content-knowledge'>법률 지식인</label>
              </div>
            </div>
          </div>

          <div className={styles.permissionColumn}>
            <div className={styles.permissionSection}>
              <div className={styles.sectionHeader}>채팅상담</div>
              <div className={styles.permissionItem}>
                <input
                  type='checkbox'
                  id='chat-list'
                  className={styles.checkbox}
                  checked={formData.subMenuIds.includes(ADMIN_PERMISSION_IDS.CHAT_LIST)}
                  onChange={e => handlePermissionChange(ADMIN_PERMISSION_IDS.CHAT_LIST, e.target.checked)}
                />
                <label htmlFor='chat-list'>채팅리스트</label>
              </div>
            </div>

            <div className={styles.permissionSection}>
              <div className={styles.sectionHeader}>게시판</div>
              <div className={styles.permissionItem}>
                <input
                  type='checkbox'
                  id='board-notice'
                  className={styles.checkbox}
                  checked={formData.subMenuIds.includes(ADMIN_PERMISSION_IDS.BOARD_NOTICE)}
                  onChange={e => handlePermissionChange(ADMIN_PERMISSION_IDS.BOARD_NOTICE, e.target.checked)}
                />
                <label htmlFor='board-notice'>공지사항</label>
              </div>
              <div className={styles.permissionItem}>
                <input
                  type='checkbox'
                  id='board-faq'
                  className={styles.checkbox}
                  checked={formData.subMenuIds.includes(ADMIN_PERMISSION_IDS.BOARD_FAQ)}
                  onChange={e => handlePermissionChange(ADMIN_PERMISSION_IDS.BOARD_FAQ, e.target.checked)}
                />
                <label htmlFor='board-faq'>FAQ</label>
              </div>
              <div className={styles.permissionItem}>
                <input
                  type='checkbox'
                  id='board-dictionary'
                  className={styles.checkbox}
                  checked={formData.subMenuIds.includes(ADMIN_PERMISSION_IDS.BOARD_DICTIONARY)}
                  onChange={e => handlePermissionChange(ADMIN_PERMISSION_IDS.BOARD_DICTIONARY, e.target.checked)}
                />
                <label htmlFor='board-dictionary'>법률 사전</label>
              </div>
            </div>

            <div className={styles.permissionSection}>
              <div className={styles.sectionHeader}>광고 관리</div>
              <div className={styles.permissionItem}>
                <input
                  type='checkbox'
                  id='ad-lawfirm'
                  className={styles.checkbox}
                  checked={formData.subMenuIds.includes(ADMIN_PERMISSION_IDS.AD_LAWFIRM)}
                  onChange={e => handlePermissionChange(ADMIN_PERMISSION_IDS.AD_LAWFIRM, e.target.checked)}
                />
                <label htmlFor='ad-lawfirm'>로펌 광고</label>
              </div>
              <div className={styles.permissionItem}>
                <input
                  type='checkbox'
                  id='ad-banner'
                  className={styles.checkbox}
                  checked={formData.subMenuIds.includes(ADMIN_PERMISSION_IDS.AD_BANNER)}
                  onChange={e => handlePermissionChange(ADMIN_PERMISSION_IDS.AD_BANNER, e.target.checked)}
                />
                <label htmlFor='ad-banner'>배너 광고</label>
              </div>
              <div className={styles.permissionItem}>
                <input
                  type='checkbox'
                  id='ad-lawyer'
                  className={styles.checkbox}
                  checked={formData.subMenuIds.includes(ADMIN_PERMISSION_IDS.AD_LAWYER)}
                  onChange={e => handlePermissionChange(ADMIN_PERMISSION_IDS.AD_LAWYER, e.target.checked)}
                />
                <label htmlFor='ad-lawyer'>변호사 광고</label>
              </div>
            </div>

            <div className={styles.permissionSection}>
              <div className={styles.sectionHeader}>통계</div>
              <div className={styles.permissionItem}>
                <input
                  type='checkbox'
                  id='statistics'
                  className={styles.checkbox}
                  checked={formData.subMenuIds.includes(ADMIN_PERMISSION_IDS.STATISTICS)}
                  onChange={e => handlePermissionChange(ADMIN_PERMISSION_IDS.STATISTICS, e.target.checked)}
                />
                <label htmlFor='statistics'>통계 바로가기</label>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AdminForm
