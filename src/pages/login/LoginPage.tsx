import { Button, Checkbox, Form, Input } from 'antd'
import styles from './loginPage.module.scss'
import Logo from '@/assets/imgs/allbarlaw-logo.png'

const LoginPage = () => {
  const onFinish = (values: unknown) => {
    console.log('Success:', values)
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
          <Form.Item name='username' rules={[{ required: true, message: '아이디를 입력해주세요!' }]}>
            <Input placeholder='아이디를 입력해주세요' size='large' />
          </Form.Item>

          <Form.Item name='password' rules={[{ required: true, message: '비밀번호를 입력해주세요!' }]}>
            <Input.Password placeholder='비밀번호를 입력해주세요' size='large' />
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit' className={styles['login-form-button']} size='large'>
              로그인
            </Button>
          </Form.Item>

          <Form.Item>
            <div className={styles['login-form-options']}>
              <Form.Item name='remember' valuePropName='checked' noStyle>
                <Checkbox>아이디 저장하기</Checkbox>
              </Form.Item>

              <a className={styles['login-form-forgot']} href=''>
                아이디/비밀번호 찾기
              </a>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default LoginPage
