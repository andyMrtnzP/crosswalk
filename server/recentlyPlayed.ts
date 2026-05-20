import { Router } from 'express';
import { db, type RecentlyPlayedItem } from './db';

const MAX_ENTRIES = 50;
const VALID_TYPES: ReadonlyArray<RecentlyPlayedItem['type']> = ['album', 'playlist', 'artist'];

function isValidItem(value: unknown): value is RecentlyPlayedItem {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' &&
    candidate.id.length > 0 &&
    typeof candidate.type === 'string' &&
    VALID_TYPES.includes(candidate.type as RecentlyPlayedItem['type'])
  );
}

export const recentlyPlayedRouter = Router();

recentlyPlayedRouter.get('/', (_req, res) => {
  res.json({ recentlyPlayed: db.data.recentlyPlayed });
});

recentlyPlayedRouter.post('/', async (req, res) => {
  if (!isValidItem(req.body)) {
    res
      .status(400)
      .json({ error: 'Body must be { type: "album"|"playlist"|"artist", id: string }.' });
    return;
  }

  const { type, id } = req.body;
  const filtered = db.data.recentlyPlayed.filter((item) => !(item.type === type && item.id === id));
  db.data.recentlyPlayed = [{ type, id }, ...filtered].slice(0, MAX_ENTRIES);
  await db.write();

  res.json({ recentlyPlayed: db.data.recentlyPlayed });
});
