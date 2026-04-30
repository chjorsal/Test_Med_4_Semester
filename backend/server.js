import express from "express";
import { pool } from "../db/connect.js";

const db = pool();

const port = 3000;
const server = express();
server.use(express.static("frontend"));
server.listen(port, onLoadLogPort);

function onLoadLogPort() {
  console.log("Server er loadet med port", port);
}
