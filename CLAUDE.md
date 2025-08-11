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

### 에디터 페이지 기본 레이아웃
모든 에디터 페이지(등록/수정 폼)는 다음과 같은 테이블 형태의 레이아웃을 따릅니다:

#### HTML 구조:
```tsx
<div className={styles.formRow}>
  <div className={styles.labelCol}>
    <label className={styles.label}>라벨명</label>
  </div>
  <div className={styles.inputCol}>
    {/* Input, Select, TextArea 등의 폼 컴포넌트 */}
  </div>
</div>
```

#### SCSS 스타일:
```scss
&__form {
  border-top: 1px solid #d9d9d9;
  
  .formRow {
    display: flex;
    align-items: stretch;
    margin-bottom: 0;
    border-bottom: 1px solid #d9d9d9;
    
    &:last-child {
      margin-bottom: 24px;
    }
    
    // TextArea가 있는 row에 대한 특별 처리 예시
    &:nth-child(3) {
      .labelCol {
        align-items: flex-start;
        padding-top: 20px;
      }
      
      .inputCol {
        align-items: flex-start;
      }
    }
  }

  .labelCol {
    width: 150px;
    flex-shrink: 0;
    padding: 16px;
    background-color: #fafafa;
    border-right: 1px solid #d9d9d9;
    display: flex;
    align-items: center;
    min-height: 56px;
  }

  .inputCol {
    flex: 1;
    padding: 16px;
    display: flex;
    align-items: center;
    min-height: 56px;
  }

  .label {
    display: block;
    margin: 0;
    font-weight: 500;
    text-align: left;
    color: #262626;
    font-size: 14px;
  }
}
```

#### 특징:
- 테이블 형태의 깔끔한 레이아웃
- 라벨 컬럼은 회색 배경(#fafafa)으로 구분
- 각 행은 border로 구분
- 첫 번째 컬럼의 왼쪽과 마지막 컬럼의 오른쪽 border는 없음
- TextArea 등 높이가 다른 요소는 별도 처리
- 최소 높이 56px로 일관된 행 높이 유지

## 기타 규칙
(추후 추가)