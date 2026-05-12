import { BookOpen, Home, ListMusic, Search, Users } from "lucide-react";

export type AlbumRecord = {
  id: string;
  name: string;
  artist?: string;
  year?: number;
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

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', icon: Home },
  { label: 'Search', icon: Search },
  { label: 'Library', icon: BookOpen },
  { label: 'Artists', icon: Users },
  { label: 'Playlists', icon: ListMusic },
];
