import AdminForm from '@/container/admin/adminForm/AdminForm'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { message, Button } from 'antd'

import styles from './adminRegisterPage.module.scss'
import { useCreateAdmin } from '@/hooks/mutations/useCreateAdmin'
import { useUpdateAdmin } from '@/hooks/queries/useAdmin'
import { errorHandle } from '@/utils/errorHandle'

const AdminRegisterPage = () => {
  const navigate = useNavigate()
  const { adminId } = useParams()
  const location = useLocation()
  const isEditMode = Boolean(adminId)

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    accountType: '1' as '1' | '2',
    account: '',
    email: '',
    name: '',
    password: '',
    passwordConfirm: '',
    isActive: true,
    subMenuIds: [] as number[],
  })

  const { mutate: createAdmin } = useCreateAdmin({
    onError: (error: any) => {
      const code = error.response.data.code
      message.error(errorHandle(code))
    },
  })
  const { mutate: updateAdmin } = useUpdateAdmin(Number(adminId))

  // 수정 모드일 때 데이터 불러오기
  useEffect(() => {
    if (isEditMode && location.state?.adminData) {
      const adminData = location.state.adminData

      // adminSubMenus에서 subMenuId 배열 추출
      const extractedSubMenuIds = adminData.adminSubMenus?.map((subMenu: any) => subMenu.subMenuId) || []

      setFormData({
        accountType: adminData.adminAccountTypeId === 1 ? '1' : '2',
        account: adminData.adminAccount || '',
        email: adminData.adminEmail || '',
        name: adminData.adminName || '',
        password: '', // 수정 모드에서는 비밀번호를 비워둠
        passwordConfirm: '',
        isActive: adminData.adminIsActive ?? true,
        subMenuIds: extractedSubMenuIds, // 추출한 subMenuId 배열 사용
      })
    }
  }, [isEditMode, location.state])

  const handleSave = async () => {
    // 필수 필드 검사
    if (!formData.account || !formData.email || !formData.name) {
      message.error('필수 필드를 입력해주세요.')
      return
    }

    // 아이디 유효성 검사
    if (formData.account.length < 4 || formData.account.length > 20) {
      message.error('아이디는 4자 이상 20자 이하여야 합니다.')
      return
    }
    const accountRegex = /^[a-zA-Z0-9_]+$/
    if (!accountRegex.test(formData.account)) {
      message.error('아이디는 영문, 숫자, 언더스코어만 사용 가능합니다.')
      return
    }

    // 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      message.error('올바른 이메일 형식이 아닙니다.')
      return
    }

    // 계정이름 유효성 검사
    if (formData.name.length < 2 || formData.name.length > 50) {
      message.error('계정이름은 2자 이상 50자 이하여야 합니다.')
      return
    }

    // 권한 체크
    if (!formData.subMenuIds || formData.subMenuIds.length === 0) {
      message.error('권한 설정이 필요합니다.')
      return
    }

    // 비밀번호 유효성 검사
    if (!isEditMode || formData.password) {
      // 등록 모드이거나 수정 모드에서 비밀번호를 입력한 경우
      if (!isEditMode && !formData.password) {
        message.error('비밀번호를 입력해주세요.')
        return
      }

      if (formData.password) {
        if (formData.password.length < 8 || formData.password.length > 20) {
          message.error('비밀번호는 8자 이상 20자 이하여야 합니다.')
          return
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
        if (!passwordRegex.test(formData.password)) {
          message.error('비밀번호는 대문자, 소문자, 숫자, 특수문자를 각각 하나 이상 포함해야 합니다.')
          return
        }

        if (formData.password !== formData.passwordConfirm) {
          message.error('비밀번호가 일치하지 않습니다.')
          return
        }
      }
    }

    try {
      setLoading(true)

      if (isEditMode) {
        // 수정 모드: 비밀번호가 비어있으면 제외
        const requestData: any = {
          adminAccount: formData.account,
          adminEmail: formData.email,
          adminName: formData.name,
          adminAccountTypeId: formData.accountType === '1' ? 1 : 2,
          adminIsActive: formData.isActive,
          subMenuIds: formData.subMenuIds,
        }

        // 비밀번호가 입력된 경우에만 포함
        if (formData.password) {
          requestData.adminPassword = formData.password
          requestData.adminPasswordRepeat = formData.passwordConfirm
        }

        updateAdmin(requestData)
      } else {
        // 등록 모드
        const requestData = {
          adminAccount: formData.account,
          adminEmail: formData.email,
          adminName: formData.name,
          adminAccountTypeId: formData.accountType === '1' ? 1 : 2,
          adminIsActive: formData.isActive,
          adminPassword: formData.password,
          adminPasswordRepeat: formData.passwordConfirm,
          subMenuIds: formData.subMenuIds,
        }
        createAdmin(requestData)
      }
    } catch (error) {
      console.error('저장 실패:', error)
      message.error(isEditMode ? '수정에 실패했습니다.' : '등록에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate(-1)
  }

  return (
    <div className={styles['admin-register-page']}>
      <div className={styles['admin-register-page__button-container']}>
        <Button onClick={handleCancel}>취소</Button>
        <Button onClick={handleSave} loading={loading} type='primary'>
          {isEditMode ? '계정 수정' : '신규 계정 등록'}
        </Button>
      </div>
      <AdminForm formData={formData} onChange={setFormData} isEditMode={isEditMode} />
    </div>
  )
}

export default AdminRegisterPage
