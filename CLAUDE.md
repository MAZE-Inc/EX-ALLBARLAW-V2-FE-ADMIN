# CLAUDE.md - 프로젝트 코딩 규칙

## UI 컴포넌트 규칙

### 엑셀 다운로드 버튼 디자인
엑셀 다운로드 버튼은 다음과 같은 표준 디자인을 따릅니다:

```tsx
import { Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'

<Button 
  icon={<DownloadOutlined />}
  onClick={handleExcelDownload}
  disabled={selectedItems.length === 0}
>
  선택 항목 엑셀 다운로드 ({selectedItems.length}건)
</Button>
```

#### 특징:
- `DownloadOutlined` 아이콘 사용
- 선택된 항목이 없을 때 `disabled` 상태
- 버튼 텍스트에 선택된 항목 수 표시
- 형식: "선택 항목 엑셀 다운로드 (N건)"

## 기타 규칙
(추후 추가)