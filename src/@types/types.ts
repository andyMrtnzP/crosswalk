export type AlbumRecord = {
  id: string
  name: string
  artist?: string
  year?: number
}

export type SubsonicResponse = {
  'subsonic-response': {
    status: 'ok' | 'failed'
    error?: {
      code?: number
      message?: string
    }
    albumList2?: {
      album?: AlbumRecord[]
    }
  }
}

export type RequestParams = Record<string, string | number | boolean | null | undefined>

export type SubsonicEnvelope = {
  'subsonic-response'?: {
    status?: 'ok' | 'failed'
    error?: {
      message?: string
    }
  }
}

export type UseNavidromeRequestResult<T> = {
  error: Error | null
  data: T | null
  isLoading: boolean
  refetch: () => Promise<T | null>
}