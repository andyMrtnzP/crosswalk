import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { RequestParams } from '@/@types/types';
import useNavidromeRequest from './useNavidromeRequest';

type PaginationOptions = {
  pageSize?: number;
};

type UseNavidromePaginationResult<TItem> = {
  items: TItem[];
  error: Error | null;
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  sentinelRef: (node: HTMLElement | null) => void;
};

export default function useNavidromePagination<TResponse, TItem>(
  url: string,
  getterFn: (response: TResponse) => TItem[] | undefined,
  params?: RequestParams,
  options?: PaginationOptions
): UseNavidromePaginationResult<TItem> {
  const pageSize = options?.pageSize ?? 20;

  const baseParamsKey = useMemo(() => {
    const entries = Object.entries(params ?? {})
      .filter(([, value]) => value !== null && value !== undefined)
      .map(([key, value]) => [key, String(value)] as const)
      .sort(([left], [right]) => left.localeCompare(right));
    return JSON.stringify(entries);
  }, [params]);

  const [offset, setOffset] = useState(0);
  const [items, setItems] = useState<TItem[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const selectItemsRef = useRef(getterFn);
  useEffect(() => {
    selectItemsRef.current = getterFn;
  }, [getterFn]);

  const lastDataRef = useRef<TResponse | null>(null);

  useEffect(() => {
    setItems([]);
    setOffset(0);
    setHasMore(true);
    lastDataRef.current = null;
  }, [baseParamsKey]);

  const requestParams = useMemo(
    () => ({ ...(params ?? {}), size: pageSize, offset }),
    [params, pageSize, offset]
  );

  const { data, error, isLoading } = useNavidromeRequest<TResponse>(url, requestParams);

  useEffect(() => {
    if (!data || data === lastDataRef.current) return;
    lastDataRef.current = data;
    const batch = selectItemsRef.current(data) ?? [];
    setItems((prev) => (offset === 0 ? batch : [...prev, ...batch]));
    setHasMore(batch.length === pageSize);
  }, [data, offset, pageSize]);

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    setOffset((current) => current + pageSize);
  }, [isLoading, hasMore, pageSize]);

  const loadMoreRef = useRef(loadMore);
  useEffect(() => {
    loadMoreRef.current = loadMore;
  }, [loadMore]);

  const observerRef = useRef<IntersectionObserver | null>(null);

  const sentinelRef = useCallback((node: HTMLElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    if (!node) return;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMoreRef.current();
        }
      },
      { rootMargin: '320px' }
    );
    observerRef.current.observe(node);
  }, []);

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return { items, error, isLoading, hasMore, loadMore, sentinelRef };
}
