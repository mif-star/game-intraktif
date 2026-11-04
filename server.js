const fs = require("node:fs");
const path = require("node:path");

function loadLocalEnv() {
  const envFile = path.join(__dirname, ".env");
  if (!fs.existsSync(envFile)) return;

  for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!match || match[1] in process.env) continue;
    let value = match[2];
    if (value.startsWith('"') && value.endsWith('"')) {
      value = JSON.parse(value);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1);
    }
    process.env[match[1]] = value.replace(/\\n/g, "\n");
  }
}

loadLocalEnv();

const http = require("node:http");
const handleApi = require("./api/game");

const root = __dirname;
const port = Number(process.env.PORT) || 3000;
const publicFiles = new Map([
  ["/index.html", "index.html"],
  ["/style.css", "style.css"],
  ["/script.js", "script.js"],
  ["/aset 1.jpe", "aset 1.jpe"],
  ["/aset2.jpe", "aset2.jpe"],
  ["/aset3.jpe", "aset3.jpe"]
]);
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".jpe": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml"
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname === "/api/game") {
    const chunks = [];
    let size = 0;
    req.on("data", chunk => {
      size += chunk.length;
      if (size > 1_000_000) {
        res.writeHead(413, { "content-type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ error: "Permintaan terlalu besar." }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      if (res.writableEnded) return;
      try {
        req.body = req.method === "POST"
          ? JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}")
          : undefined;
      } catch {
        res.writeHead(400, { "content-type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ error: "Format JSON tidak valid." }));
        return;
      }
      handleApi(req, res);
    });
    return;
  }

  let requestedPath;
  try {
    requestedPath = decodeURIComponent(url.pathname);
  } catch {
    res.writeHead(400);
    res.end("Bad request");
    return;
  }
  if (requestedPath === "/") requestedPath = "/index.html";
  const publicFile = publicFiles.get(requestedPath);
  if (!publicFile) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }
  const filePath = path.join(root, publicFile);
  fs.stat(filePath, (statError, stat) => {
    if (statError || !stat.isFile()) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, {
      "content-type": mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream"
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(port, () => {
  console.log("Game tersedia di http://localhost:" + port);
});
