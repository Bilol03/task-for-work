// script.js
const http = require('http')
const { URL } = require("url")

const API_URL = "https://test.icorp.uz/interview.php";
const CALLBACK_PORT = 5050;
const CALLBACK_URL = `https://dakota-renounceable-farcically.ngrok-free.dev/callback`; // here should be your ngrok link

console.log("Starting callback server...");

// STEP 1: Start local HTTP server to receive second part of code
let secondPart = null;

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/callback") {
    let body = "";

    req.on("data", chunk => { body += chunk; });
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        secondPart = data.part2;
        console.log("\n[✔] Received second part:", secondPart);
      } catch (e) {
        console.error("[!] Invalid JSON in callback:", body);
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok" }));
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(CALLBACK_PORT, async () => {
  console.log(`[✔] Callback server running at ${CALLBACK_URL}`);
});

 
// Utility: wait for second part
function waitForSecondPart() {
  return new Promise(resolve => {
    const check = setInterval(() => {
      if (secondPart !== null) {
        clearInterval(check);
        resolve();
      }
    }, 200);
  });
}
