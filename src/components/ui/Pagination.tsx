import { useMemo } from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showNumbers?: number
  showEdges?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'minimal' | 'rounded'
  showInfo?: boolean
  totalItems?: number
  itemsPerPage?: number
  className?: string
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  showNumbers = 5,
  showEdges = true,
  size = 'md',
  variant = 'default',
  showInfo = false,
  totalItems,
  itemsPerPage,
  className = ''
}: PaginationProps) {
  if (totalPages <= 1) return null

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  }

  const variantClasses = {
    default: {
      base: 'font-medium transition-colors border',
      active: 'bg-blue-600 text-white border-blue-600',
      inactive: 'text-gray-700 border-gray-300 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-300',
      disabled: 'text-gray-400 border-gray-200 cursor-not-allowed',
      ellipsis: 'text-gray-400 border-transparent cursor-default'
    },
    minimal: {
      base: 'font-medium transition-colors',
      active: 'bg-blue-600 text-white',
      inactive: 'text-gray-700 hover:text-blue-600 hover:bg-blue-50',
      disabled: 'text-gray-400 cursor-not-allowed',
      ellipsis: 'text-gray-400 cursor-default'
    },
    rounded: {
      base: 'font-medium transition-colors',
      active: 'bg-blue-600 text-white shadow-md',
      inactive: 'text-gray-700 bg-white shadow-sm hover:text-blue-600 hover:bg-blue-50 hover:shadow-md',
      disabled: 'text-gray-400 bg-gray-100 cursor-not-allowed',
      ellipsis: 'text-gray-400 bg-transparent cursor-default'
    }
  }

  const roundedClass = variant === 'rounded' ? 'rounded-full' : 'rounded-md'

  const visiblePages = useMemo(() => {
    const pages: (number | string)[] = []
    const half = Math.floor(showNumbers / 2)
    
    let start = Math.max(1, currentPage - half)
    let end = Math.min(totalPages, start + showNumbers - 1)
    
    if (end - start + 1 < showNumbers) {
      start = Math.max(1, end - showNumbers + 1)
    }
    
    // Always show first page if showEdges is true
    if (showEdges && start > 1) {
      pages.push(1)
      if (start > 2) pages.push('...')
    }
    
    // Visible pages
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    // Always show last page if showEdges is true
    if (showEdges && end < totalPages) {
      if (end < totalPages - 1) pages.push('...')
      pages.push(totalPages)
    }
    
    return pages
  }, [currentPage, totalPages, showNumbers, showEdges])

  const getPageInfo = () => {
    if (!showInfo || !totalItems || !itemsPerPage) return null
    
    const start = (currentPage - 1) * itemsPerPage + 1
    const end = Math.min(currentPage * itemsPerPage, totalItems)
    
    return (
      <div className="text-sm text-gray-600 mb-4 text-center">
        Hiển thị <span className="font-medium">{start}-{end}</span> trong tổng số{' '}
        <span className="font-medium">{totalItems.toLocaleString()}</span> kết quả
      </div>
    )
  }

  const PaginationButton = ({ 
    onClick, 
    disabled, 
    active, 
    children, 
    isEllipsis = false 
  }: {
    onClick?: () => void
    disabled?: boolean
    active?: boolean
    children: React.ReactNode
    isEllipsis?: boolean
  }) => {
    const getClassName = () => {
      const baseClass = `${sizeClasses[size]} ${variantClasses[variant].base} ${roundedClass}`
      
      if (isEllipsis) {
        return `${baseClass} ${variantClasses[variant].ellipsis}`
      }
      
      if (disabled) {
        return `${baseClass} ${variantClasses[variant].disabled}`
      }
      
      if (active) {
        return `${baseClass} ${variantClasses[variant].active}`
      }
      
      return `${baseClass} ${variantClasses[variant].inactive}`
    }

    return (
      <button
        onClick={onClick}
        disabled={disabled || isEllipsis}
        className={getClassName()}
        type="button"
      >
        {children}
      </button>
    )
  }

  const QuickJump = () => {
    if (totalPages <= 10) return null
    
    return (
      <div className="flex items-center space-x-2 mt-4">
        <span className="text-sm text-gray-600">Đi đến trang:</span>
        <input
          type="number"
          min={1}
          max={totalPages}
          className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const page = parseInt((e.target as HTMLInputElement).value)
              if (page >= 1 && page <= totalPages) {
                onPageChange(page)
              }
            }
          }}
        />
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      {getPageInfo()}
      
      <div className="flex items-center justify-center space-x-1">
        {/* First page button */}
        {showEdges && currentPage > 3 && (
          <>
            <PaginationButton
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
            >
              ⏮️
            </PaginationButton>
            <div className="w-2" />
          </>
        )}

        {/* Previous button */}
        <PaginationButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {size === 'sm' ? '‹' : '← Trước'}
        </PaginationButton>

        {/* Page numbers */}
        {visiblePages.map((page, index) => (
          <PaginationButton
            key={index}
            onClick={() => typeof page === 'number' ? onPageChange(page) : undefined}
            active={page === currentPage}
            isEllipsis={typeof page === 'string'}
          >
            {page}
          </PaginationButton>
        ))}

        {/* Next button */}
        <PaginationButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          {size === 'sm' ? '›' : 'Sau →'}
        </PaginationButton>

        {/* Last page button */}
        {showEdges && currentPage < totalPages - 2 && (
          <>
            <div className="w-2" />
            <PaginationButton
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              ⏭️
            </PaginationButton>
          </>
        )}
      </div>

      <QuickJump />
    </div>
  )
}
