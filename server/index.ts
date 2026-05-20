import express from 'express';
import { recentlyPlayedRouter } from './recentlyPlayed';

const PORT = Number(process.env.PORT) || 3001;

const app = express();
app.use(express.json());

app.use('/api/recently-played', recentlyPlayedRouter);

app.listen(PORT, () => {
  console.log(`[crosswalk-api] listening on http://localhost:${PORT}`);
});
