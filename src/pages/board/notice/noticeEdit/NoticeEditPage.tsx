import ContentForm from '@/components/contentForm/ContentForm'

const NoticeEditPage = () => {
  const handleSave = (data: { title: string; content: string; radioValue?: string }) => {
    console.log('저장할 데이터:', data)
    // TODO: API 호출하여 공지사항 저장
  }

  const handleCancel = () => {
    console.log('취소')
    // TODO: 이전 페이지로 이동
  }

  const radioOptions = [
    { label: '공지', value: 'notice' },
    { label: '업데이트', value: 'update' },
    { label: '이벤트', value: 'event' },
  ]

  return (
    <section style={{ padding: 36 }}>
      <ContentForm
        titlePlaceholder='공지사항 제목을 입력하세요'
        contentPlaceholder='공지사항 내용을 작성하세요...'
        saveButtonText='공지 등록'
        radioLabel='공지 유형'
        showRadio={true}
        radioOptions={radioOptions}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </section>
  )
}

export default NoticeEditPage
