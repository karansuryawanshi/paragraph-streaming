const { createClient } = require("@deepgram/sdk");
const fetch = require("cross-fetch");
const dotenv = require("dotenv");
const express = require("express");
const http = require("http");
const WebSocket = require("ws");

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", async (message) => {
    const paragraph = message.toString();
    const words = paragraph.split(" ");

    for (let i = 0; i < words.length; i++) {
      const word = words[i];

      console.log(`Sending word: ${word}`);
      ws.send(word);

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    ws.send("END_STREAM");
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
