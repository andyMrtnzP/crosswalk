import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { JSONFilePreset } from 'lowdb/node';

export type RecentlyPlayedItem = {
  type: 'album' | 'playlist' | 'artist';
  id: string;
};

export type DatabaseSchema = {
  recentlyPlayed: RecentlyPlayedItem[];
};

const DB_DIR = path.resolve(process.cwd(), 'data', '.crosswalk');
const DB_FILE = path.join(DB_DIR, 'db.json');

const defaultData: DatabaseSchema = { recentlyPlayed: [] };

await mkdir(DB_DIR, { recursive: true });

export const db = await JSONFilePreset<DatabaseSchema>(DB_FILE, defaultData);
