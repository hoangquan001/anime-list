import { useState, useCallback, useMemo } from 'react'

interface UsePaginationOptions {
  initialPage?: number
  initialItemsPerPage?: number
  totalItems: number
  onPageChange?: (page: number, itemsPerPage: number) => void
  onItemsPerPageChange?: (itemsPerPage: number, page: number) => void
}

interface UsePaginationReturn {
  currentPage: number
  itemsPerPage: number
  totalPages: number
  startIndex: number
  endIndex: number
  goToPage: (page: number) => void
  goToNextPage: () => void
  goToPrevPage: () => void
  goToFirstPage: () => void
  goToLastPage: () => void
  setItemsPerPage: (itemsPerPage: number) => void
  canGoNext: boolean
  canGoPrev: boolean
  pageInfo: {
    start: number
    end: number
    total: number
    currentPage: number
    totalPages: number
  }
}

export function usePagination({
  initialPage = 1,
  initialItemsPerPage = 25,
  totalItems,
  onPageChange,
  onItemsPerPageChange
}: UsePaginationOptions): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [itemsPerPage, setItemsPerPageState] = useState(initialItemsPerPage)

  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / itemsPerPage)
  }, [totalItems, itemsPerPage])

  const startIndex = useMemo(() => {
    return (currentPage - 1) * itemsPerPage
  }, [currentPage, itemsPerPage])

  const endIndex = useMemo(() => {
    return Math.min(startIndex + itemsPerPage - 1, totalItems - 1)
  }, [startIndex, itemsPerPage, totalItems])

  const canGoNext = currentPage < totalPages
  const canGoPrev = currentPage > 1

  const goToPage = useCallback((page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(validPage)
    onPageChange?.(validPage, itemsPerPage)
  }, [totalPages, itemsPerPage, onPageChange])

  const goToNextPage = useCallback(() => {
    if (canGoNext) {
      goToPage(currentPage + 1)
    }
  }, [canGoNext, currentPage, goToPage])

  const goToPrevPage = useCallback(() => {
    if (canGoPrev) {
      goToPage(currentPage - 1)
    }
  }, [canGoPrev, currentPage, goToPage])

  const goToFirstPage = useCallback(() => {
    goToPage(1)
  }, [goToPage])

  const goToLastPage = useCallback(() => {
    goToPage(totalPages)
  }, [goToPage, totalPages])

  const setItemsPerPage = useCallback((newItemsPerPage: number) => {
    setItemsPerPageState(newItemsPerPage)
    
    // Recalculate current page to maintain position
    const newTotalPages = Math.ceil(totalItems / newItemsPerPage)
    const newPage = Math.min(currentPage, newTotalPages)
    
    setCurrentPage(newPage)
    onItemsPerPageChange?.(newItemsPerPage, newPage)
  }, [currentPage, totalItems, onItemsPerPageChange])

  const pageInfo = useMemo(() => ({
    start: startIndex + 1,
    end: endIndex + 1,
    total: totalItems,
    currentPage,
    totalPages
  }), [startIndex, endIndex, totalItems, currentPage, totalPages])

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    goToNextPage,
    goToPrevPage,
    goToFirstPage,
    goToLastPage,
    setItemsPerPage,
    canGoNext,
    canGoPrev,
    pageInfo
  }
}
