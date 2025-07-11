import { Button, Checkbox, Form, Input, Modal } from 'antd'
import styles from './loginPage.module.scss'
import Logo from '@/assets/imgs/allbarlaw-logo.png'
import { useState } from 'react'
import { useLoginMutation } from '@/hooks/mutations/useLoginMutation'
import { LoginCredentials } from '@/types/authTypes'

const LoginPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { mutate: login, isPending } = useLoginMutation()

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const onFinish = (values: LoginCredentials) => {
    login(values)
  }

  const onFinishFailed = (errorInfo: unknown) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <div className={styles['login-page']}>
      <div className={styles['header']}>
        <img src={Logo} alt='올바로 로고' className={styles['logo']} />
        <div className={styles['header-text']}>
          <h2>통합 관리자 Admin</h2>
          <p>통합 관리자 계정으로 로그인 하세요</p>
        </div>
      </div>
      <div className={styles['login-form']}>
        <Form
          name='basic'
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
          className={styles['login-form-fields']}
        >
          <Form.Item name='adminAccount' rules={[{ required: true, message: '아이디를 입력해주세요!' }]}>
            <Input placeholder='아이디를 입력해주세요' size='large' />
          </Form.Item>

          <Form.Item name='adminPassword' rules={[{ required: true, message: '비밀번호를 입력해주세요!' }]}>
            <Input.Password placeholder='비밀번호를 입력해주세요' size='large' />
          </Form.Item>

          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              className={styles['login-form-button']}
              size='large'
              loading={isPending}
            >
              {isPending ? '로그인 중...' : '로그인'}
            </Button>
          </Form.Item>

          <Form.Item>
            <div className={styles['login-form-options']}>
              <Form.Item name='remember' valuePropName='checked' noStyle>
                <Checkbox>아이디 저장하기</Checkbox>
              </Form.Item>

              <a className={styles['login-form-forgot']} onClick={showModal}>
                아이디/비밀번호 찾기
              </a>
            </div>
          </Form.Item>
        </Form>
      </div>
      <Modal
        title='아이디 또는 비밀번호 찾기'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        footer={null}
      >
        <div className={styles['modal-content']}>
          <p>{`가입시 등록하신 이메일 주소를 입력하시면\n메일로 아이디와 초기화된 비밀번호를 발송해드립니다.`}</p>
          <div className={styles['modal-input']}>
            <label htmlFor='email'>이메일 주소</label>
            <Input placeholder='이메일 주소를 입력해주세요' />
          </div>
          <Button type='primary' htmlType='submit' className={styles['login-form-button']} size='large'>
            아이디 및 초기화된 비밀번호 메일로 받기
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default LoginPage
