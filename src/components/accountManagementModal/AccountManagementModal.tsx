import { Modal, Form, Input, Radio, Button, message } from 'antd'
import { useState, useEffect } from 'react'
import styles from './account-management-modal.module.scss'
import { useResetPassword, useUpdateMemberStatus } from '@/hooks/queries/useMember'

interface AdminAccountManagementModalProps {
  visible: boolean
  onClose: () => void
  accountInfo: { userId: number; userIsActive: boolean; userBanReason: string | null }
  // onUpdate: (adminId: number, isActive: boolean) => void; // 필요시 사용
}

const AccountManagementModal = ({ visible, onClose, accountInfo }: AdminAccountManagementModalProps) => {
  const [form] = Form.useForm()
  const [isFormValid, setIsFormValid] = useState(false)
  const [isActive, setIsActive] = useState(true)
  const { mutate: resetPassword, isPending: isResetPasswordPending } = useResetPassword()
  const { mutate: updateMemberStatus } = useUpdateMemberStatus()

  useEffect(() => {
    if (visible && accountInfo) {
      setIsActive(accountInfo.userIsActive)
      form.setFieldsValue({
        adminIsActive: accountInfo.userIsActive,
        suspendReason: accountInfo.userBanReason || '',
      })
    }
  }, [visible, accountInfo, form])

  const handleFieldsChange = () => {
    const values = form.getFieldsValue(['adminIsActive', 'suspendReason'])
    const isChanged =
      values.adminIsActive !== accountInfo.userIsActive || values.suspendReason !== (accountInfo.userBanReason || '')
    // '정지'일 때만 정지사유 필수, '사용'일 때는 상관없음
    const isSuspendAndEmpty = values.adminIsActive === false && !values.suspendReason?.trim()
    setIsFormValid(isChanged && (values.adminIsActive === true || !isSuspendAndEmpty))
  }

  // 계정 사용여부(라디오) 변경 시 인풋 및 값 초기화
  const handleActiveChange = (e: any) => {
    const newIsActive = e.target.value
    setIsActive(newIsActive)

    form.setFields([
      {
        name: 'suspendReason',
        errors: [],
      },
    ])

    // "사용"으로 변경 시 suspendReason을 빈 문자열로 설정
    form.setFieldsValue({ suspendReason: '' })
    handleFieldsChange()
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()

      const mutationData = {
        userId: accountInfo.userId,
        isActive: values.adminIsActive,
        userBanReason: values.adminIsActive ? null : values.suspendReason,
      }

      updateMemberStatus(mutationData, {
        onSuccess: () => {
          message.success('계정 상태가 업데이트되었습니다.')
          onClose()
        },
        onError: error => {
          console.error('Mutation error:', error)
          // 에러 시 모달은 열어둠
        },
      })
    } catch (error) {
      console.error('Form validation error:', error)
    }
  }

  const handlePasswordInit = () => {
    resetPassword(accountInfo.userId, {
      onSuccess: () => {
        message.success('등록한 E-mail로 초기화된 비밀번호가 발송되었습니다.')
      },
      onError: error => {
        console.error('Password reset error:', error)
        message.error('비밀번호 초기화에 실패했습니다.')
      },
    })
  }

  return (
    <Modal
      title='회원 계정 관리'
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      width={650}
      footer={[
        <Button key='cancel' onClick={onClose}>
          취소
        </Button>,
        <Button key='ok' type='primary' onClick={handleSubmit} disabled={!isFormValid}>
          저장
        </Button>,
      ]}
    >
      <Form form={form} layout='vertical' className={styles.form} onFieldsChange={handleFieldsChange}>
        <table className={styles.accountTable}>
          <tbody>
            <tr>
              <td className={styles.label}>계정 사용여부</td>
              <td>
                <Form.Item
                  name='adminIsActive'
                  noStyle
                  rules={[{ required: true, message: '계정 사용여부를 선택하세요.' }]}
                >
                  <Radio.Group onChange={handleActiveChange}>
                    <Radio value={true}>사용</Radio>
                    <Radio value={false}>정지</Radio>
                  </Radio.Group>
                </Form.Item>
              </td>
            </tr>
            <tr>
              <td className={styles.label}>계정 정지사유</td>
              <td>
                <Form.Item
                  name='suspendReason'
                  noStyle
                  rules={[{ required: !isActive, message: '정지사유를 입력하세요.' }]}
                >
                  <Input.TextArea
                    rows={4}
                    placeholder={isActive ? '' : '계정 정지 사유를 입력하세요.'}
                    className={styles.fixedTextarea}
                    disabled={isActive}
                  />
                </Form.Item>
              </td>
            </tr>
            <tr>
              <td className={styles.label}>비밀번호 변경</td>
              <td>
                <Button onClick={handlePasswordInit} className={styles.initBtn} disabled={isResetPasswordPending}>
                  {isResetPasswordPending ? '초기화 중...' : '초기화'}
                </Button>
                <div className={styles.infoText}>※ 비밀번호 초기화를 할 경우 아이디+연락처 조합으로 초기화 됩니다.</div>
              </td>
            </tr>
          </tbody>
        </table>
      </Form>
    </Modal>
  )
}

export default AccountManagementModal
