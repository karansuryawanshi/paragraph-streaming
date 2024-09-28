const { createClient } = require("@deepgram/sdk");
const dotenv = require("dotenv");
const WebSocket = require("ws");

dotenv.config();

const handler = (req, res) => {
  const wss = new WebSocket.Server({ noServer: true });

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

  res.socket.server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  });

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WebSocket server running");
};

export default handler;
