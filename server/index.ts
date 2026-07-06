import express from 'express';
import { recentlyPlayedRouter } from './recentlyPlayed.js';
import proxy from 'express-http-proxy';
import path from 'path';

const PORT = Number(process.env.PORT) || 3001;
const NAVIDOME_URL = process.env.NAVIDOME_URL ?? 'http://localhost:4533';
const app = express();


app.use(express.json());
app.use(express.static(path.join(import.meta.dirname, '..')));

console.log(`forwording requests from /rest to ${NAVIDOME_URL}`);

app.all('/rest/*splat', proxy(NAVIDOME_URL));

app.use('/api/recently-played', recentlyPlayedRouter);

app.get('/*splat', (_, res) => {
  res.sendFile(path.join(import.meta.dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[crosswalk-api] listening on http://localhost:${PORT}`);
});
