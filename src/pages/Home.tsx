import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { SubsonicResponse } from '@/@types/types'
import { Button } from '@/components/ui/button'
import Album from '@/components/Album/Album'
import useNavidromeRequest from '@/hooks/useNavidromeRequest'

function Home() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [inputError, setInputError] = useState<string | null>(null)

  const { error, data, isLoading, refetch } = useNavidromeRequest<SubsonicResponse>('/rest/getAlbumList2.view', {
    u: username,
    p: password,
    type: 'alphabeticalByName',
    size: 500,
  })
  console.log(data);

  const albums = data?.['subsonic-response'].albumList2?.album ?? []

  const albumCount = useMemo(() => {
    if (albums.length === 1) {
      return '1 album'
    }

    return `${albums.length} albums`
  }, [albums.length])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!username || !password) {
      setInputError('Please provide both username and password.')
      return
    }

    setInputError(null)
    await refetch()
  }

  return (
    <section className="space-y-6">
      <div className="glass-panel rounded-2xl p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-card-foreground">Album catalog</h2>
        <p className="mt-1 text-sm text-muted-foreground">Log in with Navidrome credentials to fetch albums.</p>

        <form className="mt-5 grid gap-3 sm:grid-cols-3" onSubmit={handleSubmit}>
          <label className="space-y-1 text-sm text-foreground">
            <span className="font-medium">Username</span>
            <input
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground outline-none ring-ring/20 placeholder:text-muted-foreground focus:ring"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="admin"
            />
          </label>

          <label className="space-y-1 text-sm text-foreground">
            <span className="font-medium">Password</span>
            <input
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground outline-none ring-ring/20 placeholder:text-muted-foreground focus:ring"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="********"
            />
          </label>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Loading albums...' : 'Load albums'}
          </Button>
        </form>

        {inputError ? <p className="mt-3 text-sm text-destructive">{inputError}</p> : null}
        {!inputError && error ? <p className="mt-3 text-sm text-destructive">{error.message}</p> : null}
        {!error && albums.length > 0 ? <p className="mt-3 text-sm text-primary">Loaded {albumCount}</p> : null}
        {!error && !isLoading && albums.length === 0 ? (
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
