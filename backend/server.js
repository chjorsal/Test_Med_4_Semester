import express from "express";
import { pool } from "../db/connect.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = pool();

const port = 3000;
const server = express();
server.use(express.json());
server.use(express.static(path.join(__dirname, "../frontend")));
server.listen(port, onLoadLogPort);

server.get("/api/votes", async (req, res) => {
  const result = await db.query(`
    SELECT 
    tracks.track_id,
    tracks.songname,
    artist.artist,
    COUNT(votes.track_id) AS votes
    FROM tracks
    LEFT JOIN votes ON tracks.track_id = votes.track_id
    LEFT JOIN artist ON tracks.artist_id = artist.artist_id
    GROUP BY tracks.track_id, tracks.songname, artist.artist
  `);
  res.json(result.rows);
});

server.post("/api/vote", async (req, res) => {
  const trackId = req.params.trackId;

  await db.query(
    `
    INSERT INTO votes (session_id, user_id, track_id)
    VALUES ($1, $2, $3)`,
    [1, 1, trackId],
  ); // session_id and user_id are hardcoded for now
  res.json({ success: true });
});

function onLoadLogPort() {
  console.log("Server er loadet med port", port);
}
