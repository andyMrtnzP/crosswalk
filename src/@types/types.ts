export type AlbumRecord = {
  id: string;
  name: string;
  artist?: string;
  year?: number;
};

export type Playlist = {
  id: string;
  name: string;
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
