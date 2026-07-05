import { Heart } from 'lucide-react';
import type { ArtistDetail, ArtistInfo2Response } from '@/@types/types';
import useNavidromeRequest from '@/hooks/useNavidromeRequest';
import useStarred from '@/hooks/useStarred';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

export default function ArtistHero(artist: ArtistDetail) {
  const { starred, toggle: toggleStar } = useStarred(artist.id, !!artist.starred, 'artist');
  const { data: artistInfoData } = useNavidromeRequest<ArtistInfo2Response>(
    '/rest/getArtistInfo2.view',
    { id: artist.id },
    { skip: !artist.id }
  );
  const artistInfo = artistInfoData?.['subsonic-response']?.artistInfo2;

  const { data: heroBlobSrc } = useNavidromeRequest<string>(
    '/rest/getCoverArt.view',
    { id: artist?.coverArt, size: 800 },
    { responseType: 'blobUrl', skip: !artist?.coverArt }
  );
  const heroBgUrl = artistInfo?.largeImageUrl || heroBlobSrc || null;

  if (!artist || !artistInfo) {
    return <></>;
  }

  return (
    <div className="relative h-90 overflow-hidden border-b border-hairline">
      {heroBgUrl && (
        <div
          className="absolute inset-0 bg-cover artist-hero-cover"
          style={{
            backgroundImage: `url(${heroBgUrl})`,
          }}
        />
      )}
      {/* Gradient overlay */}
      <div className="absolute inset-0 artist-hero-gradient" />
      {/* Artist name + stats */}
      <div className="relative z-10 flex h-full flex-col justify-end px-9 pb-7.5">
        <h1 className="font-display text-[84px] font-medium leading-[0.92] tracking-[-0.035em] text-foreground">
          {artist.name}
        </h1>
        <div className="mt-4.5 flex items-center gap-3.5 text-[13px] text-ink-2">
          {artist.albumCount != null && (
            <span>
              <span className="font-medium text-foreground">{artist.albumCount}</span>{' '}
              {artist.albumCount === 1 ? 'album' : 'albums'}
            </span>
          )}
          <Button
            type="button"
            aria-label={starred ? 'Unlike artist' : 'Like artist'}
            aria-pressed={starred}
            onClick={toggleStar}
            variant="pill"
          >
            <Heart className={cn('h-3.5 w-3.5', starred && 'fill-current text-accent-gold')} />
            {starred ? 'Liked' : 'Like'}
          </Button>
        </div>
      </div>
    </div>
  );
}
