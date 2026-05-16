import type { Song } from "@/@types/types";
import useNavidromeRequest from "@/hooks/useNavidromeRequest";
import { formatTrackDuration } from "@/lib/utils";
import { Play } from "lucide-react";
import AnimatedEqBars from "../AnimatedEqBars/AnimatedEqBars";

const Thumb = ({ coverArt }: { coverArt?: string }) => {
  const { data: src } = useNavidromeRequest<string>(
    '/rest/getCoverArt.view',
    { id: coverArt, size: 80 },
    { responseType: 'blobUrl', skip: !coverArt }
  );

  return (
    <div className="h-10 w-10 shrink-0 overflow-hidden rounded bg-panel-3">
      {src && <img src={src} alt="" className="h-full w-full object-cover" />}
    </div>
  );
}

type PopularRowProps = {
  song: Song;
  index: number;
  isCurrentlyPlaying: boolean;
  onPlay: () => void;
};

export default function PopularTrackRow({ song, index, isCurrentlyPlaying, onPlay }: PopularRowProps) {
  return (
    <div
      className={`group grid cursor-pointer items-center gap-3.5 rounded-md px-2 py-2.25 transition-colors hover:bg-panel-2 ${isCurrentlyPlaying ? 'bg-panel-2' : ''}`}
      style={{ gridTemplateColumns: '24px 40px 1fr 60px' }}
      onClick={onPlay}
    >

      <div className="relative h-4 text-center text-[12.5px] tabular-nums text-ink-3">
        {isCurrentlyPlaying && <AnimatedEqBars />}

        {!isCurrentlyPlaying && (
          <>
            <span className="group-hover:hidden">{index}</span>
            <span className="hidden items-center justify-center group-hover:flex">
              <Play className="h-3 w-3 fill-current text-foreground" />
            </span>
          </>
        )}
      </div>

      {/* Art */}
      <Thumb coverArt={song.coverArt} />

      {/* Title + album */}
      <div className="min-w-0">
        <p
          className={`truncate text-[13px] font-medium ${isCurrentlyPlaying ? 'text-accent-gold' : 'text-foreground'}`}
        >
          {song.title}
        </p>
        {song.album && (
          <p className="mt-0.5 truncate text-[11.5px] text-ink-3">
            {song.album}
            {song.year ? ` · ${song.year}` : ''}
          </p>
        )}
      </div>

      {/* Duration */}
      <p className="text-right text-[11.5px] tabular-nums text-ink-3">
        {formatTrackDuration(song.duration)}
      </p>
    </div>
  );
}