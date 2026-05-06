import express from "express";
import { pool } from "../db/connect.js";

const db = pool();

const port = 3000;
const server = express();
server.use(express.json());
server.use(express.static("frontend"));
server.get("/api/votes", onGetVotes);
server.post("/api/votes", onPostVote);
server.listen(port, onLoadLogPort);

async function onGetVotes(request, response) {
  const dbResult = await db.query(`
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
  response.json(dbResult.rows);
}

async function onPostVote(request, response) {
  try { // vi bruger en tru chach til at tjekke at en person kun kan stemme på en sang en gang
    const trackId = request.body.track_id;
    const sessionId = request.body.session_id;
    const userId = request.body.user_id;

    const existingVote = await db.query( // denne const er lavet så vi kigger vores query igennem om en user har stemt
      `SELECT * FROM votes WHERE user_id = $1 AND track_id = $2`,
      [userId, trackId]// når det ikke længere er hard coded skal dette laves om
    );

    if (existingVote.rows.length > 0) { // hvis en bruger har stemt kommer de til at få denne fejl
      return response.status(400).json({
        error: "User already voted"
      });
    }

    await db.query(
      `INSERT INTO votes (session_id, user_id, track_id)
       VALUES ($1, $2, $3)`,
      [sessionId, userId, trackId] // når det ikke længere er hard coded skal dette laves om
    );

    response.json({ success: true });
  } catch (error) {
    console.error("Vote error:", error.message);
    response.status(500).json({ error: error.message });
  }
}

function onLoadLogPort() {
  console.log("Server er loadet med port", port);
}
