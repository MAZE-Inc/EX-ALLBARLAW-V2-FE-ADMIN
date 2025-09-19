import styles from '@/components/categorySidebar/categorySidebar.module.scss'
import { COLOR } from '@/styles/abstracts/color'

import { CategoryList } from '@/types/categoryTypes'
import { DownOutlined } from '@ant-design/icons'

interface SideBarProps {
  categories: CategoryList
  selectedMainCategory: number | null
  selectedSubcategory: number | null
  onMainCategoryClick: (_id: number) => void
  onSubcategoryClick: (_id: number) => void
  alwaysExpanded?: boolean // 항상 펼쳐보기 옵션
}

interface CategoryItemProps {
  category: CategoryList[number]
  isActive: boolean
  onClick: () => void
  selectedSubcategory: number | null
  onSubcategoryClick: (_id: number) => void
  alwaysExpanded?: boolean // 항상 펼쳐보기 옵션
}

const CategoryItem = ({
  category,
  isActive,
  onClick,
  selectedSubcategory,
  onSubcategoryClick,
  alwaysExpanded,
}: CategoryItemProps) => {
  const shouldShowSubcategories = alwaysExpanded || isActive

  return (
    <li className={styles['category-list-item']}>
      <div className={styles['category-list-header']}>
        <h3
          className={`${styles.categoryName} ${isActive ? styles.active : ''}`}
          onClick={alwaysExpanded || isActive ? undefined : onClick}
          style={{
            cursor: alwaysExpanded ? 'default' : 'pointer',
            color: isActive ? COLOR.GREEN_01 : COLOR.TEXT_INDEX,
          }}
        >
          {category.categoryName}
        </h3>
        {isActive && !alwaysExpanded && <DownOutlined />}
      </div>
      {shouldShowSubcategories && (
        <ul className={styles['subcategory-list']}>
          {category.subcategories.map(subcategory => (
            <li
              key={subcategory.subcategoryId}
              className={styles['subcategory-item']}
              style={{
                backgroundColor: selectedSubcategory === subcategory.subcategoryId ? COLOR.GRAY_01 : 'transparent',
              }}
              onClick={() => onSubcategoryClick(subcategory.subcategoryId)}
            >
              <span>{subcategory.subcategoryName}</span>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

const CategorySidebar = ({
  categories,
  selectedMainCategory,
  selectedSubcategory,
  onMainCategoryClick,
  onSubcategoryClick,
  alwaysExpanded = false,
}: SideBarProps) => {
  return (
    <nav className={styles.container} aria-label='카테고리 네비게이션'>
      <ul className={styles['category-list']}>
        {categories.map(category => (
          <CategoryItem
            key={category.categoryId}
            category={category}
            isActive={selectedMainCategory === category.categoryId}
            onClick={() => onMainCategoryClick(category.categoryId)}
            selectedSubcategory={selectedSubcategory}
            onSubcategoryClick={onSubcategoryClick}
            alwaysExpanded={alwaysExpanded}
          />
        ))}
      </ul>
    </nav>
  )
}

export default CategorySidebar
