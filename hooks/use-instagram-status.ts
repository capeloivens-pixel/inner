'use client'

import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function useInstagramStatus() {
  const { data, error, mutate } = useSWR('/api/instagram/status', fetcher, {
    refreshInterval: 60000,
  })
  return {
    isConnected: data?.isConnected ?? false,
    username: data?.username ?? '',
    status: data?.status ?? 'demo',
    isLoading: !error && !data,
    error,
    mutate,
  }
}
