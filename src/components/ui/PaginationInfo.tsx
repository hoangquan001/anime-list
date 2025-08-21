interface PaginationInfoProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  variant?: 'default' | 'compact' | 'detailed'
  className?: string
}

export function PaginationInfo({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  variant = 'default',
  className = ''
}: PaginationInfoProps) {
  const start = (currentPage - 1) * itemsPerPage + 1
  const end = Math.min(currentPage * itemsPerPage, totalItems)

  const renderDefault = () => (
    <div className={`text-sm text-gray-600 ${className}`}>
      Hiển thị <span className="font-medium text-gray-900">{start}-{end}</span> trong tổng số{' '}
      <span className="font-medium text-gray-900">{totalItems.toLocaleString()}</span> kết quả
    </div>
  )

  const renderCompact = () => (
    <div className={`text-xs text-gray-500 ${className}`}>
      {start}-{end} / {totalItems.toLocaleString()}
    </div>
  )

  const renderDetailed = () => (
    <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-600">{currentPage}</div>
          <div className="text-gray-600">Trang hiện tại</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-green-600">{totalPages}</div>
          <div className="text-gray-600">Tổng trang</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-purple-600">{end - start + 1}</div>
          <div className="text-gray-600">Hiện tại</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-orange-600">{totalItems.toLocaleString()}</div>
          <div className="text-gray-600">Tổng cộng</div>
        </div>
      </div>
    </div>
  )

  switch (variant) {
    case 'compact':
      return renderCompact()
    case 'detailed':
      return renderDetailed()
    default:
      return renderDefault()
  }
}
