import { Input, Space, Radio } from 'antd'
import styles from './admin-form.module.scss'

interface AdminFormProps {
  formData: {
    accountType: '1' | '2'
    account: string
    email: string
    name: string
    password: string
    passwordConfirm: string
    isActive: boolean
  }
  onChange: (data: {
    accountType: '1' | '2'
    account: string
    email: string
    name: string
    password: string
    passwordConfirm: string
    isActive: boolean
  }) => void
}

const AdminForm = ({ formData, onChange }: AdminFormProps) => {
  const handleChange = (field: string, value: any) => {
    onChange({
      ...formData,
      [field]: value,
    })
  }

  return (
    <div className={styles.contentForm}>
      <Space direction='vertical' size='large' className={styles.formContainer}>
        {/* 계정구분 */}
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

        {/* 아이디 */}
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

        {/* 이메일 주소 */}
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

        {/* 계정이름 */}
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

        {/* 비밀번호 */}
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

        {/* 비밀번호 확인 */}
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

        {/* 계정사용 여부 */}
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
      </Space>
    </div>
  )
}

export default AdminForm
