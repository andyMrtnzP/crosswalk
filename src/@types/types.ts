import { BookOpen, Home, ListMusic, Search, Users } from 'lucide-react';

export type AlbumRecord = {
  id: string;
  name: string;
  artist?: string;
  year?: number;
  artistId?: string;
  coverArt?: string;
  songCount?: number;
  duration?: number;
};

export type Playlist = {
  id: string;
  name: string;
  coverArt?: string;
  songCount?: number;
  duration?: number;
  created?: string;
  changed?: string;
};

export type SubsonicResponse = {
  'subsonic-response': {
    status: 'ok' | 'failed';
    error?: {
      code?: number;
      message?: string;
    };
    albumList2?: {
      album?: AlbumRecord[];
    };
  };
};

export type RequestParams = Record<string, string | number | boolean | null | undefined>;

export type RequestOptions = {
  responseType?: 'json' | 'blobUrl';
  skip?: boolean;
};

export type SubsonicEnvelope = {
  'subsonic-response'?: {
    status?: 'ok' | 'failed';
    error?: {
      message?: string;
    };
  };
};

export type UseNavidromeRequestResult<T> = {
  error: Error | null;
  data: T | null;
  isLoading: boolean;
  refetch: () => Promise<T | null>;
};

export type AuthCredentials = {
  username: string;
  password: string;
};

export type AuthContextValue = {
  credentials: AuthCredentials | null;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  error: string | null;
  login: (credentials: AuthCredentials) => Promise<boolean>;
  logout: () => void;
};

export type NavItem = {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
};

export type PlaylistsResponse = {
  'subsonic-response': {
    status: 'ok' | 'failed';
    playlists?: {
      playlist?: Playlist[];
    };
  };
};

export type ArtistRecord = {
  id: string;
  name: string;
  coverArt?: string;
  albumCount?: number;
  artistImageUrl?: string;
};

export type ArtistIndex = {
  name: string;
  artist?: ArtistRecord[];
};

export type ArtistsResponse = {
  'subsonic-response': {
    status: 'ok' | 'failed';
    artists?: {
      ignoredArticles?: string;
      index?: ArtistIndex[];
    };
  };
};

export type Song = {
  id: string;
  title: string;
  album?: string;
  albumId?: string;
  artist?: string;
  artistId?: string;
  track?: number;
  discNumber?: number;
  year?: number;
  genre?: string;
  coverArt?: string;
  duration?: number;
  bitRate?: number;
  playCount?: number;
  starred?: string;
  contentType?: string;
};

export type AlbumDetail = AlbumRecord & {
  genre?: string;
  song?: Song[];
};

export type AlbumDetailResponse = {
  'subsonic-response': {
    status: 'ok' | 'failed';
    album?: AlbumDetail;
  };
};

export type AlbumList2Response = {
  'subsonic-response': {
    status: 'ok' | 'failed';
    albumList2?: {
      album?: AlbumRecord[];
    };
  };
};

export type ArtistDetail = ArtistRecord & {
  album?: AlbumRecord[];
};

export type ArtistDetailResponse = {
  'subsonic-response': {
    status: 'ok' | 'failed';
    artist?: ArtistDetail;
  };
};

export type ArtistInfo2 = {
  biography?: string;
  musicBrainzId?: string;
  lastFmUrl?: string;
  smallImageUrl?: string;
  mediumImageUrl?: string;
  largeImageUrl?: string;
};

export type ArtistInfo2Response = {
  'subsonic-response': {
    status: 'ok' | 'failed';
    artistInfo2?: ArtistInfo2;
  };
};

export type TopSongsResponse = {
  'subsonic-response': {
    status: 'ok' | 'failed';
    topSongs?: {
      song?: Song[];
    };
  };
};

export type RepeatMode = 'none' | 'one' | 'all';

export type PlayerContextValue = {
  queue: Song[];
  currentIndex: number;
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  shuffle: boolean;
  repeat: RepeatMode;
  currentTime: number;
  duration: number;
  playQueue: (songs: Song[], startIndex?: number) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Search', path: '/search', icon: Search },
  { label: 'Library', path: '/library', icon: BookOpen },
  { label: 'Artists', path: '/artists', icon: Users },
  { label: 'Playlists', path: '/playlists', icon: ListMusic },
];
