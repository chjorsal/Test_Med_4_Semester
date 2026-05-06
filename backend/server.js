import express from "express";
import { pool } from "../db/connect.js";

const db = pool();

const port = 3000;
const server = express();
server.use(express.json());
server.use(express.static("frontend"));
server.get("/api/suggestions/:sessionId", onRandomSuggestion);

server.listen(port, onLoadLogPort);

async function onRandomSuggestion(request, respones) {
  const dbResult = await db.query(`

  select t.songname, a.artist
  from tracks t

  join artist a 
    on t.artist_id = a.artist_id
  
  
    where t.genre_id = 2
  order by random()
  limit 5;
`);
  respones.json(dbResult.rows);
}

function onLoadLogPort() {
  console.log("Server er loadet med port", port);
}
