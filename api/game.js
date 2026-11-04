const { handleAction } = require("../lib/game");

async function handleApi(req, res) {
  const origin = req.headers.origin || "";
  const localOrigin = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
  if (localOrigin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Allow", "POST, OPTIONS");
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ error: "Metode tidak didukung." }));
    return;
  }

  try {
    let body = req.body;
    try {
      if (typeof body === "string") body = JSON.parse(body);
      if (!body && typeof req.rawBody === "string") body = JSON.parse(req.rawBody);
    } catch {
      const error = new Error("Format JSON tidak valid.");
      error.status = 400;
      throw error;
    }
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      const error = new Error("Permintaan tidak valid.");
      error.status = 400;
      throw error;
    }

    const result = await handleAction(body.action, body.payload || {});
    res.statusCode = 200;
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ result }));
  } catch (error) {
    res.statusCode = error.status || 500;
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.end(JSON.stringify({
      error: error.message || "Server gagal memproses permintaan."
    }));
    if (!error.status) console.error("Game API error:", error);
  }
}

module.exports = handleApi;
