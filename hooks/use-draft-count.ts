'use client'

import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function useDraftCount() {
  const { data, error, mutate } = useSWR('/api/posts/draft-count', fetcher, {
    refreshInterval: 30000,
  })
  return {
    count: data?.count ?? 0,
    isLoading: !error && !data,
    error,
    mutate,
  }
}
