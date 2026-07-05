import { useCallback, useEffect, useRef, useState } from 'react';
import type { Song, RepeatMode, AuthCredentials } from '@/@types/types';
import { buildAuthParams } from '@/lib/auth';
import useAuth from '@/hooks/useAuth';
import { PlayerContext } from '@/providers/PlayerContext';

const SCROBBLE_MIN_SECONDS = 60;

// Fisher-Yates permutation of [0..n-1], with `first` moved to position 0
function shuffledOrder(n: number, first: number): number[] {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  if (first >= 0 && first < n) {
    const p = a.indexOf(first);
    [a[0], a[p]] = [a[p], a[0]];
  }
  return a;
}

function scrobble(songId: string, credentials: AuthCredentials, submission: boolean): void {
  const params = buildAuthParams(credentials.username, credentials.password);
  params.set('id', songId);
  params.set('submission', String(submission));
  fetch(`/rest/scrobble.view?${params.toString()}`).catch(() => {});
}

function buildStreamUrl(songId: string, credentials: AuthCredentials): string {
  const params = buildAuthParams(credentials.username, credentials.password);
  params.set('id', songId);
  return `/rest/stream.view?${params.toString()}`;
}

export default function PlayerProvider({ children }: { children: React.ReactNode }) {
  const { credentials } = useAuth();

  // Lazy-init the Audio element once
  const audioRef = useRef<HTMLAudioElement | null>(null);
  if (audioRef.current == null) {
    audioRef.current = new Audio();
  }

  const [queue, setQueue] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.8);
  const [shuffle, setShuffle] = useState(false);
  const [shuffleOrder, setShuffleOrder] = useState<number[]>([]);
  const [repeat, setRepeat] = useState<RepeatMode>('none');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Refs used inside audio event handlers to avoid stale closures
  const shuffleRef = useRef(shuffle);
  const shuffleOrderRef = useRef(shuffleOrder);
  const repeatRef = useRef(repeat);
  const queueRef = useRef(queue);
  const currentIndexRef = useRef(currentIndex);
  // Latest advance() for the audio 'ended' handler, which binds once
  const advanceRef = useRef<() => void>(() => {});

  useEffect(() => {
    shuffleRef.current = shuffle;
    shuffleOrderRef.current = shuffleOrder;
    repeatRef.current = repeat;
    queueRef.current = queue;
    currentIndexRef.current = currentIndex;
  }, [shuffle, shuffleOrder, repeat, queue, currentIndex]);

  // Attach persistent audio event listeners once
  useEffect(() => {
    const audio = audioRef.current!;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(isNaN(audio.duration) ? 0 : audio.duration);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      if (repeatRef.current === 'one') {
        audio.currentTime = 0;
        void audio.play();
        return;
      }
      advanceRef.current();
      // advance() is a no-op at end of queue without repeat: stay paused
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
    };
  }, []);

  // Set initial volume
  useEffect(() => {
    audioRef.current!.volume = volume;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentSong = queue[currentIndex] ?? null;

  // When the current song changes, load the new src and auto-play
  useEffect(() => {
    const audio = audioRef.current!;
    if (!currentSong || !credentials) {
      audio.pause();
      audio.src = '';
      return;
    }

    const url = buildStreamUrl(currentSong.id, credentials);
    audio.src = url;
    void audio.play();
  }, [currentSong?.id, credentials?.username]); // eslint-disable-line react-hooks/exhaustive-deps

  const playQueue = useCallback((songs: Song[], startIndex = 0) => {
    setQueue(songs);
    setCurrentIndex(startIndex);
    if (shuffleRef.current) setShuffleOrder(shuffledOrder(songs.length, startIndex));
  }, []);

  const playNext = useCallback((song: Song) => {
    const insertAt = currentIndexRef.current + 1;
    setQueue((q) => [...q.slice(0, insertAt), song, ...q.slice(insertAt)]);
    setShuffleOrder((order) => {
      if (order.length === 0) return order; // not shuffling
      const shifted = order.map((i) => (i >= insertAt ? i + 1 : i));
      const curPos = shifted.indexOf(currentIndexRef.current);
      return [...shifted.slice(0, curPos + 1), insertAt, ...shifted.slice(curPos + 1)];
    });
  }, []);

  const addToQueue = useCallback((song: Song) => {
    const newIndex = queueRef.current.length;
    setQueue((q) => [...q, song]);
    setShuffleOrder((order) => (order.length === 0 ? order : [...order, newIndex]));
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current!;
    if (audio.paused) {
      void audio.play();
    } else {
      audio.pause();
    }
  }, []);

  // Advance to the next track, honoring shuffle order and repeat-all wrap.
  // No-op at the end of the queue when repeat is off.
  const advance = useCallback(() => {
    const q = queueRef.current;
    const idx = currentIndexRef.current;
    if (shuffleRef.current) {
      const order = shuffleOrderRef.current;
      const pos = order.indexOf(idx);
      if (pos >= 0 && pos < order.length - 1) {
        setCurrentIndex(order[pos + 1]!);
      } else if (repeatRef.current === 'all' && q.length > 0) {
        const reshuffled = shuffledOrder(q.length, -1);
        setShuffleOrder(reshuffled);
        setCurrentIndex(reshuffled[0]!);
      }
      return;
    }
    if (idx < q.length - 1) {
      setCurrentIndex(idx + 1);
    } else if (repeatRef.current === 'all') {
      setCurrentIndex(0);
    }
  }, []);
  useEffect(() => {
    advanceRef.current = advance;
  }, [advance]);

  const next = advance;

  const prev = useCallback(() => {
    const audio = audioRef.current!;
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    if (shuffleRef.current) {
      const order = shuffleOrderRef.current;
      const pos = order.indexOf(currentIndexRef.current);
      if (pos > 0) setCurrentIndex(order[pos - 1]!);
      return;
    }
    setCurrentIndex((idx) => Math.max(0, idx - 1));
  }, []);

  const seek = useCallback((time: number) => {
    audioRef.current!.currentTime = time;
    setCurrentTime(time);
  }, []);

  const setVolume = useCallback((vol: number) => {
    audioRef.current!.volume = vol;
    setVolumeState(vol);
  }, []);

  const toggleShuffle = useCallback(() => {
    setShuffle((s) => {
      const on = !s;
      setShuffleOrder(on ? shuffledOrder(queueRef.current.length, currentIndexRef.current) : []);
      return on;
    });
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'Space' && e.key !== ' ') return;

      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable) {
          return;
        }
      }

      e.preventDefault();
      togglePlay();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [togglePlay]);

  // scrobble
  useEffect(() => {
    if (!credentials || !currentSong) return;
    const audio = audioRef.current!;

    scrobble(currentSong.id, credentials, false);

    let scrobbled = false;
    const onTimeUpdate = () => {
      if (scrobbled) return;
      const dur = audio.duration;
      if (!isFinite(dur) || dur <= 0) return;
      if (audio.currentTime >= dur / 2 || audio.currentTime >= SCROBBLE_MIN_SECONDS) {
        scrobbled = true;
        scrobble(currentSong.id, credentials, true);
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    return () => audio.removeEventListener('timeupdate', onTimeUpdate);
  }, [currentSong?.id, credentials?.username]); // eslint-disable-line react-hooks/exhaustive-deps

  const cycleRepeat = useCallback(() => {
    setRepeat((r) => {
      if (r === 'none') return 'all';
      if (r === 'all') return 'one';
      return 'none';
    });
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        queue,
        currentIndex,
        currentSong,
        isPlaying,
        volume,
        shuffle,
        shuffleOrder,
        repeat,
        currentTime,
        duration,
        playQueue,
        playNext,
        addToQueue,
        togglePlay,
        next,
        prev,
        seek,
        setVolume,
        toggleShuffle,
        cycleRepeat,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
