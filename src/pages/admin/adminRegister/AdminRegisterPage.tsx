import AdminForm from '@/container/admin/adminForm/AdminForm'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { message, ConfigProvider, Button } from 'antd'
import { COLOR } from '@/styles/abstracts/color'
import styles from './adminRegisterPage.module.scss'
import { useCreateAdmin } from '@/hooks/mutations/useCreateAdmin'

const AdminRegisterPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    accountType: '1' as '1' | '2',
    account: '',
    email: '',
    name: '',
    password: '',
    passwordConfirm: '',
    isActive: true,
  })

  const { mutate: createAdmin } = useCreateAdmin()

  const handleSave = async () => {
    // 유효성 검사
    if (!formData.account || !formData.email || !formData.name || !formData.password || !formData.passwordConfirm) {
      message.error('모든 필드를 입력해주세요.')
      return
    }
    if (formData.password !== formData.passwordConfirm) {
      message.error('비밀번호가 일치하지 않습니다.')
      return
    }

    try {
      setLoading(true)
      createAdmin({
        adminAccount: formData.account,
        adminEmail: formData.email,
        adminName: formData.name,
        adminAccountTypeId: formData.accountType === '1' ? 1 : 2,
        adminIsActive: formData.isActive,
        adminPassword: formData.password,
        adminPasswordRepeat: formData.passwordConfirm,
      })
    } catch (error) {
      console.error('등록 실패:', error)
      message.error('등록에 실패했습니다.')
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
        <Button className={styles['admin-register-page__button']} onClick={handleCancel}>
          취소
        </Button>
        <Button className={styles['admin-register-page__button']} onClick={handleSave} loading={loading} type='primary'>
          신규 계정 등록
        </Button>
      </div>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: COLOR.GREEN_02,
          },
        }}
      >
        <section style={{ padding: 36 }}>
          <AdminForm formData={formData} onChange={setFormData} />
        </section>
      </ConfigProvider>
    </div>
  )
}

export default AdminRegisterPage
