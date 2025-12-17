import { useCallback, useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { PAGE_LIMIT, QUERY_PAGE_NAME } from './model'

export type UseShowMoreOptions = {
  totalCount?: number
}

export function useShowMore(options: UseShowMoreOptions = {}) {
  const { totalCount } = options
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const page = useMemo(() => {
    const raw = searchParams?.get(QUERY_PAGE_NAME)
    const n = raw ? Number(raw) : 1
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1
  }, [searchParams])

  const visibleCount = page * PAGE_LIMIT

  const hasMore = useMemo(() => {
    if (typeof totalCount === 'number') return visibleCount < totalCount
    return true
  }, [totalCount, visibleCount])

  const onShowMore = useCallback(() => {
    const nextPage = page + 1
    const params = new URLSearchParams(searchParams?.toString() || '')
    params.set(QUERY_PAGE_NAME, String(nextPage))
    router.push(`${pathname}?${params.toString()}`)
  }, [page, pathname, router, searchParams])

  return { page, visibleCount, hasMore, onShowMore }
}

export type UseShowMoreReturn = ReturnType<typeof useShowMore>
