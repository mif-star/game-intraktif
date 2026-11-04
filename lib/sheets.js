const crypto = require("node:crypto");

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const SERVICE_ACCOUNT_PRIVATE_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

const HEADERS = {
  Players: ["username", "name", "kelas", "passwordSalt", "passwordHash", "avatar", "violations", "terminated", "terminationReason", "createdAt"],
  Answers: ["id", "username", "level", "stage", "question", "answer", "correct", "points", "status", "date"],
  Settings: ["key", "value"],
  Sessions: ["tokenHash", "principal", "expiresAt", "revoked"],
  LoginAttempts: ["key", "attempts", "expiresAt"]
};

let accessToken;
let accessTokenExpiresAt = 0;
let schemaCheckedAt = 0;

function configError() {
  const missing = [];
  if (!SHEET_ID) missing.push("GOOGLE_SHEET_ID");
  if (!SERVICE_ACCOUNT_EMAIL) missing.push("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  if (!SERVICE_ACCOUNT_PRIVATE_KEY) missing.push("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY");
  if (missing.length) {
    throw new Error("Konfigurasi Vercel belum lengkap: " + missing.join(", ") + ".");
  }
}

function base64Url(value) {
  return Buffer.from(value).toString("base64url");
}

async function getAccessToken() {
  configError();
  if (accessToken && Date.now() < accessTokenExpiresAt - 60_000) return accessToken;

  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64Url(JSON.stringify({
    iss: SERVICE_ACCOUNT_EMAIL,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600
  }));
  const unsigned = header + "." + claims;
  const privateKey = SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, "\n");
  const signature = crypto.sign("RSA-SHA256", Buffer.from(unsigned), privateKey).toString("base64url");
  const assertion = unsigned + "." + signature;
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion
    })
  });
  const result = await response.json();
  if (!response.ok || !result.access_token) {
    throw new Error("Autentikasi Google Sheets gagal: " + (result.error_description || result.error || response.status));
  }

  accessToken = result.access_token;
  accessTokenExpiresAt = Date.now() + Number(result.expires_in || 3600) * 1000;
  return accessToken;
}

async function sheetsRequest(path, options = {}) {
  const token = await getAccessToken();
  const response = await fetch("https://sheets.googleapis.com/v4/spreadsheets/" + encodeURIComponent(SHEET_ID) + path, {
    ...options,
    headers: {
      authorization: "Bearer " + token,
      ...(options.body ? { "content-type": "application/json" } : {}),
      ...options.headers
    }
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = body.error && body.error.message ? body.error.message : response.statusText;
    throw new Error("Google Sheets API: " + message);
  }
  return body;
}

async function ensureSchema() {
  if (Date.now() - schemaCheckedAt < 60_000) return;
  const metadata = await sheetsRequest("?fields=sheets.properties(sheetId,title)");
  const existing = new Set((metadata.sheets || []).map(sheet => sheet.properties.title));
  const missing = Object.keys(HEADERS).filter(name => !existing.has(name));
  if (missing.length) {
    await sheetsRequest(":batchUpdate", {
      method: "POST",
      body: JSON.stringify({
        requests: missing.map(title => ({ addSheet: { properties: { title } } }))
      })
    });
    const headerData = missing.map(name => ({
      range: name + "!A1:" + String.fromCharCode(64 + HEADERS[name].length) + "1",
      values: [HEADERS[name]]
    }));
    await sheetsRequest("/values:batchUpdate", {
      method: "POST",
      body: JSON.stringify({ valueInputOption: "RAW", data: headerData })
    });
  }
  schemaCheckedAt = Date.now();
}

async function readTables(names) {
  await ensureSchema();
  const query = names.map(name => "ranges=" + encodeURIComponent(name + "!A1:" + String.fromCharCode(64 + HEADERS[name].length))).join("&");
  const result = await sheetsRequest("/values:batchGet?" + query + "&valueRenderOption=UNFORMATTED_VALUE");
  return Object.fromEntries((result.valueRanges || []).map((item, index) => {
    const rows = item.values || [];
    return [names[index], rows.slice(1).map(row =>
      Array.from({ length: HEADERS[names[index]].length }, (_, column) => row[column] ?? "")
    )];
  }));
}

async function readTable(name) {
  const [rows] = Object.values(await readTables([name]));
  return rows;
}

async function appendRow(name, row) {
  await ensureSchema();
  const range = encodeURIComponent(name + "!A:" + String.fromCharCode(64 + HEADERS[name].length));
  await sheetsRequest("/values/" + range + ":append?valueInputOption=RAW&insertDataOption=INSERT_ROWS", {
    method: "POST",
    body: JSON.stringify({ values: [row] })
  });
}

async function updateCell(name, rowNumber, column, value) {
  await ensureSchema();
  const range = encodeURIComponent(name + "!" + column + rowNumber);
  await sheetsRequest("/values/" + range + "?valueInputOption=RAW", {
    method: "PUT",
    body: JSON.stringify({ values: [[value]] })
  });
}

async function updateRow(name, rowNumber, row) {
  await ensureSchema();
  const lastColumn = String.fromCharCode(64 + HEADERS[name].length);
  const range = encodeURIComponent(name + "!A" + rowNumber + ":" + lastColumn + rowNumber);
  await sheetsRequest("/values/" + range + "?valueInputOption=RAW", {
    method: "PUT",
    body: JSON.stringify({ values: [row] })
  });
}

async function clearDataRows(name) {
  await ensureSchema();
  const range = encodeURIComponent(name + "!A2:" + String.fromCharCode(64 + HEADERS[name].length));
  await sheetsRequest("/values/" + range + ":clear", { method: "POST", body: "{}" });
}

module.exports = {
  HEADERS,
  appendRow,
  clearDataRows,
  readTable,
  readTables,
  updateCell,
  updateRow
};
