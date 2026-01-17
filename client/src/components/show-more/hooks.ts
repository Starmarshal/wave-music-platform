import {useCallback, useMemo} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {QUERY_PAGE_NAME, TRACKS_PAGE_LIMIT} from './model';

export type UseShowMoreOptions = {
  totalCount?: number;
  limit?: number;
}

export function useShowMore(options: UseShowMoreOptions = {}) {
  const {totalCount, limit = TRACKS_PAGE_LIMIT} = options;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const page = useMemo(() => {
    const raw = searchParams?.get(QUERY_PAGE_NAME);
    const n = raw ? Number(raw) : 1;
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
  }, [searchParams]);

  const visibleCount = page * limit;

  const hasMore = useMemo(() => {
    if (typeof totalCount === 'number') return visibleCount < totalCount;
    return true;
  }, [totalCount, visibleCount]);

  const onShowMore = useCallback(() => {
    const nextPage = page + 1;
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set(QUERY_PAGE_NAME, String(nextPage));
    router.push(`${pathname}?${params.toString()}`);
  }, [page, pathname, router, searchParams]);

  return {page, visibleCount, hasMore, onShowMore};
}

export type UseShowMoreReturn = ReturnType<typeof useShowMore>
