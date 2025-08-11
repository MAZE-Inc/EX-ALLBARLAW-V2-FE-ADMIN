import AdminForm from '@/container/admin/adminForm/AdminForm'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { message, Button } from 'antd'

import styles from './adminRegisterPage.module.scss'
import { useCreateAdmin } from '@/hooks/mutations/useCreateAdmin'
import { useUpdateAdmin } from '@/hooks/queries/useAdmin'

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

  const { mutate: createAdmin } = useCreateAdmin()
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
    // 유효성 검사
    if (!formData.account || !formData.email || !formData.name) {
      message.error('필수 필드를 입력해주세요.')
      return
    }

    // 등록 모드에서만 비밀번호 필수
    if (!isEditMode && (!formData.password || !formData.passwordConfirm)) {
      message.error('비밀번호를 입력해주세요.')
      return
    }

    // 비밀번호가 입력된 경우 일치 여부 확인
    if (formData.password && formData.password !== formData.passwordConfirm) {
      message.error('비밀번호가 일치하지 않습니다.')
      return
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
