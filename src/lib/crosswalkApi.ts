export type RecentlyPlayedItem = {
  type: 'album' | 'playlist' | 'artist';
  id: string;
};

type RecentlyPlayedResponse = { recentlyPlayed: RecentlyPlayedItem[] };

export async function getRecentlyPlayed(): Promise<RecentlyPlayedItem[]> {
  const response = await fetch('/api/recently-played');
  if (!response.ok) {
    throw new Error(`Failed to load recently played (status ${response.status}).`);
  }
  const payload = (await response.json()) as RecentlyPlayedResponse;
  return payload.recentlyPlayed;
}

export async function recordRecentlyPlayed(
  type: RecentlyPlayedItem['type'],
  id: string
): Promise<RecentlyPlayedItem[]> {
  const response = await fetch('/api/recently-played', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, id }),
  });
  if (!response.ok) {
    throw new Error(`Failed to record recently played (status ${response.status}).`);
  }
  const payload = (await response.json()) as RecentlyPlayedResponse;
  return payload.recentlyPlayed;
}
