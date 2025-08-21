interface PaginationControlsProps {
  itemsPerPage: number
  onItemsPerPageChange: (itemsPerPage: number) => void
  options?: number[]
  totalItems?: number
  showJumpToPage?: boolean
  currentPage?: number
  totalPages?: number
  onPageJump?: (page: number) => void
  className?: string
}

export function PaginationControls({
  itemsPerPage,
  onItemsPerPageChange,
  options = [10, 25, 50, 100],
  totalItems,
  showJumpToPage = false,
  currentPage = 1,
  totalPages = 1,
  onPageJump,
  className = ''
}: PaginationControlsProps) {
  const handlePageJump = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onPageJump) {
      const value = parseInt((e.target as HTMLInputElement).value)
      if (value >= 1 && value <= totalPages) {
        onPageJump(value)
        ;(e.target as HTMLInputElement).value = ''
      }
    }
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Items per page */}
      <div className="flex items-center space-x-2">
        <label htmlFor="items-per-page" className="text-sm text-gray-600 whitespace-nowrap">
          Hiển thị:
        </label>
        <select
          id="items-per-page"
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(parseInt(e.target.value))}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
          {totalItems && totalItems < Math.max(...options) && (
            <option value={totalItems}>Tất cả ({totalItems})</option>
          )}
        </select>
        <span className="text-sm text-gray-600 whitespace-nowrap">mục/trang</span>
      </div>

      {/* Jump to page */}
      {showJumpToPage && onPageJump && totalPages > 1 && (
        <div className="flex items-center space-x-2">
          <label htmlFor="jump-to-page" className="text-sm text-gray-600 whitespace-nowrap">
            Đi đến trang:
          </label>
          <input
            id="jump-to-page"
            type="number"
            min={1}
            max={totalPages}
            placeholder={currentPage.toString()}
            onKeyDown={handlePageJump}
            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <span className="text-sm text-gray-600">
            (1-{totalPages})
          </span>
        </div>
      )}
    </div>
  )
}
