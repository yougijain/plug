import React from 'react'

export const getCategoryIconAndLabel = (category?: string) => {
  const key = (category || '').toLowerCase()
  if (key.includes('ticket')) return { icon: '🎟', label: 'Ticket' }
  if (key.includes('food')) return { icon: '🍕', label: 'Food' }
  if (key.includes('elect')) return { icon: '📱', label: 'Electronics' }
  if (key.includes('book')) return { icon: '📚', label: 'Books' }
  if (key.includes('service')) return { icon: '🤝', label: 'Service' }
  if (key.includes('transport') || key.includes('ride')) return { icon: '🚗', label: 'Ride' }
  if (key.includes('clothing')) return { icon: '👕', label: 'Clothing' }
  if (key.includes('furniture')) return { icon: '🪑', label: 'Furniture' }
  if (key.includes('sport')) return { icon: '⚽', label: 'Sports' }
  return { icon: '📦', label: 'Item' }
}

interface CategoryPlaceholderProps {
  category?: string
  size?: number // square size in px
  showLabel?: boolean
}

const CategoryPlaceholder: React.FC<CategoryPlaceholderProps> = ({ category, size = 64, showLabel = true }) => {
  const { icon, label } = getCategoryIconAndLabel(category)
  const iconSize = Math.round(size * 0.5)

  return (
    <div
      className="rounded-lg bg-[#F5F5F5] flex flex-col items-center justify-center"
      style={{ width: size, height: size }}
    >
      <span className="text-[#6F7A85]" style={{ fontSize: iconSize }}>{icon}</span>
      {showLabel && (
        <span className="text-[10px] text-[#9AA5B1] leading-tight mt-0.5 truncate" style={{ maxWidth: size }}>{label}</span>
      )}
    </div>
  )
}

export default CategoryPlaceholder


