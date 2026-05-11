import { useMemo, useState } from 'react'
import type { SubsonicResponse } from '@/@types/types'
import { Button } from '@/components/ui/button'
import Album from '@/components/Album/Album'
import useAuth from '@/hooks/useAuth'
import useNavidromeRequest from '@/hooks/useNavidromeRequest'

function Home() {
  const { credentials } = useAuth()
  const [hasRequested, setHasRequested] = useState(false)

  const { error, data, isLoading, refetch } = useNavidromeRequest<SubsonicResponse>('/rest/getAlbumList2.view', {
    u: credentials?.username,
    p: credentials?.password,
    type: 'alphabeticalByName',
    size: 500,
  })

  const albums = data?.['subsonic-response'].albumList2?.album ?? []

  const albumCount = useMemo(() => {
    if (albums.length === 1) {
      return '1 album'
    }

    return `${albums.length} albums`
  }, [albums.length])

  const handleRefresh = async () => {
    setHasRequested(true)
    await refetch()
  }

  if (!credentials) {
    return null
  }

  return (
    <section className="space-y-6">
      <div className="glass-panel rounded-2xl p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-card-foreground">Album catalog</h2>
        <p className="mt-1 text-sm text-muted-foreground">Authenticated as {credentials.username}. Fetch available albums from Navidrome.</p>

        <div className="mt-5">
          <Button type="button" onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? 'Loading albums...' : 'Load albums'}
          </Button>
        </div>

        {error ? <p className="mt-3 text-sm text-destructive">{error.message}</p> : null}
        {!error && albums.length > 0 ? <p className="mt-3 text-sm text-primary">Loaded {albumCount}</p> : null}
        {!error && !isLoading && hasRequested && albums.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No albums loaded yet.</p>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {albums.map((album) => (
          <Album key={album.id} album={album} />
        ))}
      </div>
    </section>
  )
}

export default Home
