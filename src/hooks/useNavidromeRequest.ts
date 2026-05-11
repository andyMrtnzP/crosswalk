import { useState } from 'react'
import type {
  RequestParams,
  SubsonicEnvelope,
  UseNavidromeRequestResult,
} from '@/@types/types'

function useNavidromeRequest<T>(url: string, params: RequestParams): UseNavidromeRequestResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const refetch = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const searchParams = new URLSearchParams({
        v: '1.16.1',
        c: 'crosswalk-web',
        f: 'json',
      })

      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          searchParams.append(key, String(value))
        }
      })

      const separator = url.includes('?') ? '&' : '?'
      const response = await fetch(`${url}${separator}${searchParams.toString()}`)
      const payload = (await response.json()) as T

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}.`)
      }

      const subsonic = (payload as SubsonicEnvelope)['subsonic-response']
      if (subsonic?.status === 'failed') {
        throw new Error(subsonic.error?.message ?? 'Navidrome returned an error.')
      }

      setData(payload)
      return payload
    } catch (caughtError) {
      setData(null)
      const normalizedError = caughtError instanceof Error ? caughtError : new Error('Unexpected request error.')
      setError(normalizedError)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    error,
    data,
    isLoading,
    refetch,
  }
}

export default useNavidromeRequest
