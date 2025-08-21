import { Pagination } from './Pagination'
import { PaginationInfo } from './PaginationInfo'
import { PaginationControls } from './PaginationControls'

interface PaginationWrapperProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onItemsPerPageChange?: (itemsPerPage: number) => void
  
  // Pagination props
  showNumbers?: number
  showEdges?: boolean
  paginationSize?: 'sm' | 'md' | 'lg'
  paginationVariant?: 'default' | 'minimal' | 'rounded'
  
  // Info props
  showInfo?: boolean
  infoVariant?: 'default' | 'compact' | 'detailed'
  
  // Controls props
  showControls?: boolean
  showJumpToPage?: boolean
  itemsPerPageOptions?: number[]
  
  // Layout
  layout?: 'stack' | 'split' | 'inline'
  className?: string
}

export function PaginationWrapper({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  
  // Pagination props
  showNumbers = 5,
  showEdges = true,
  paginationSize = 'md',
  paginationVariant = 'default',
  
  // Info props
  showInfo = true,
  infoVariant = 'default',
  
  // Controls props
  showControls = false,
  showJumpToPage = false,
  itemsPerPageOptions = [10, 25, 50, 100],
  
  // Layout
  layout = 'stack',
  className = ''
}: PaginationWrapperProps) {
  if (totalPages <= 1 && !showInfo && !showControls) return null

  const renderStack = () => (
    <div className={`space-y-4 ${className}`}>
      {showInfo && (
        <PaginationInfo
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          variant={infoVariant}
          className="text-center"
        />
      )}
      
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          showNumbers={showNumbers}
          showEdges={showEdges}
          size={paginationSize}
          variant={paginationVariant}
        />
      )}
      
      {showControls && onItemsPerPageChange && (
        <PaginationControls
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={onItemsPerPageChange}
          options={itemsPerPageOptions}
          totalItems={totalItems}
          showJumpToPage={showJumpToPage}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageJump={onPageChange}
          className="justify-center"
        />
      )}
    </div>
  )

  const renderSplit = () => (
    <div className={`flex flex-col lg:flex-row items-center justify-between gap-4 ${className}`}>
      <div className="flex flex-col items-center lg:items-start space-y-2">
        {showInfo && (
          <PaginationInfo
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            variant={infoVariant}
          />
        )}
        
        {showControls && onItemsPerPageChange && (
          <PaginationControls
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={onItemsPerPageChange}
            options={itemsPerPageOptions}
            totalItems={totalItems}
            showJumpToPage={showJumpToPage}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageJump={onPageChange}
          />
        )}
      </div>
      
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          showNumbers={showNumbers}
          showEdges={showEdges}
          size={paginationSize}
          variant={paginationVariant}
        />
      )}
    </div>
  )

  const renderInline = () => (
    <div className={`flex flex-wrap items-center justify-center gap-4 ${className}`}>
      {showInfo && (
        <PaginationInfo
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          variant="compact"
        />
      )}
      
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          showNumbers={showNumbers}
          showEdges={showEdges}
          size={paginationSize}
          variant={paginationVariant}
        />
      )}
      
      {showControls && onItemsPerPageChange && (
        <PaginationControls
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={onItemsPerPageChange}
          options={itemsPerPageOptions}
          totalItems={totalItems}
          showJumpToPage={showJumpToPage}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageJump={onPageChange}
        />
      )}
    </div>
  )

  switch (layout) {
    case 'split':
      return renderSplit()
    case 'inline':
      return renderInline()
    default:
      return renderStack()
  }
}
