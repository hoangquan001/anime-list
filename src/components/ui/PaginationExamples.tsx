/*
Example usage of the Pagination components

1. Basic Pagination
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
/>

2. Advanced Pagination with custom styling
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
  showNumbers={7}
  showEdges={true}
  size="lg"
  variant="rounded"
  showInfo={true}
  totalItems={1000}
  itemsPerPage={25}
/>

3. Pagination with Info
<PaginationInfo
  currentPage={currentPage}
  totalPages={totalPages}
  totalItems={totalItems}
  itemsPerPage={itemsPerPage}
  variant="detailed"
/>

4. Pagination with Controls
<PaginationControls
  itemsPerPage={itemsPerPage}
  onItemsPerPageChange={handleItemsPerPageChange}
  options={[10, 25, 50, 100]}
  totalItems={totalItems}
  showJumpToPage={true}
  currentPage={currentPage}
  totalPages={totalPages}
  onPageJump={handlePageChange}
/>

5. Complete Pagination Wrapper
<PaginationWrapper
  currentPage={currentPage}
  totalPages={totalPages}
  totalItems={totalItems}
  itemsPerPage={itemsPerPage}
  onPageChange={handlePageChange}
  onItemsPerPageChange={handleItemsPerPageChange}
  
  // Pagination options
  showNumbers={5}
  showEdges={true}
  paginationSize="md"
  paginationVariant="default"
  
  // Info options
  showInfo={true}
  infoVariant="default"
  
  // Controls options
  showControls={true}
  showJumpToPage={true}
  itemsPerPageOptions={[10, 25, 50, 100]}
  
  // Layout
  layout="split"
  className="my-8"
/>

6. Using the usePagination hook
import { usePagination } from '@/hooks'

function MyComponent() {
  const {
    currentPage,
    itemsPerPage,
    totalPages,
    goToPage,
    goToNextPage,
    goToPrevPage,
    setItemsPerPage,
    canGoNext,
    canGoPrev,
    pageInfo
  } = usePagination({
    initialPage: 1,
    initialItemsPerPage: 25,
    totalItems: data.length,
    onPageChange: (page, itemsPerPage) => {
      // Handle page change
      console.log(`Page changed to ${page} with ${itemsPerPage} items per page`)
    }
  })

  return (
    <div>
      Your content
      {displayedData.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
      
      Pagination
      <PaginationWrapper
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={data.length}
        itemsPerPage={itemsPerPage}
        onPageChange={goToPage}
        onItemsPerPageChange={setItemsPerPage}
        layout="split"
        showControls={true}
        showJumpToPage={true}
      />
    </div>
  )
}

7. Different variants showcase
// Default variant
<Pagination variant="default" size="md" />

// Minimal variant (no borders)
<Pagination variant="minimal" size="sm" />

// Rounded variant (circular buttons)
<Pagination variant="rounded" size="lg" />

// Different info variants
<PaginationInfo variant="default" />   // Standard text
<PaginationInfo variant="compact" />   // Short format
<PaginationInfo variant="detailed" />  // Grid with stats

// Different layouts
<PaginationWrapper layout="stack" />   // Vertical stack
<PaginationWrapper layout="split" />   // Info left, pagination right
<PaginationWrapper layout="inline" />  // All in one line
*/

export {}
