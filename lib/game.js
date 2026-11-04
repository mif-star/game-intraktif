const crypto = require("node:crypto");
const {
  appendRow,
  clearDataRows,
  readTable,
  readTables,
  updateCell,
  updateRow
} = require("./sheets");

const SESSION_MS = 6 * 60 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 10;

const MCQ_ANSWER_KEYS = [
  ["Local Area Network", "Dua atau lebih perangkat yang saling terhubung", "Berbagi data dan sumber daya", "Node", "Berbagi printer dan file"],
  ["Kecil atau lokal", "Kota", "Wide Area Network", "Personal Area Network", "Sangat luas"],
  ["Router", "LAN", "Nirkabel atau Wi-Fi", "Semua port", "Network Interface Card"],
  ["Star", "Kabel backbone utama", "Lingkaran", "Banyak jalur antarnode", "Kerusakan satu kabel klien tidak selalu memutus klien lain"],
  ["4 pasang kabel", "RJ45", "Cahaya", "Gangguan elektromagnetik", "Crimping tool"],
  ["Identitas alamat perangkat di jaringan", "32 bit", "Bagian network dan host", "192.168.1.10", "Private"],
  ["Andal dan berorientasi koneksi", "Menerjemahkan nama domain ke alamat IP", "Memberikan konfigurasi IP otomatis", "Web", "Tanpa koneksi dan overhead rendah"],
  ["80", "443", "53", "22", "21"],
  ["ping", "DHCP gagal memberi alamat", "Kabel dan konektor", "ipconfig", "DNS"],
  ["Switch", "Router", "DHCP", "DNS", "ping alamat-gateway"]
];

const SHORT_ANSWER_KEYS = [
  [["local area network", "lan"], ["data", "informasi"], ["node"], ["protokol"], ["printer", "file", "data", "internet"]],
  [["lan"], ["man"], ["wide area network", "wan"], ["pan"], ["luas", "global", "besar"]],
  [["router"], ["switch"], ["access point", "ap"], ["network interface card", "nic"], ["hub"]],
  [["star", "bintang"], ["bus"], ["mesh"], ["ring"], ["switch", "hub"]],
  [["4", "empat"], ["rj45"], ["fiber optik", "fiber optic", "serat optik"], ["elektromagnetik", "interferensi"], ["crimping tool", "tang crimping", "crimping"]],
  [["alamat", "identitas"], ["32", "tiga puluh dua"], ["host"], ["private", "pribadi"], ["dhcp"]],
  [["tcp"], ["dns"], ["dhcp"], ["http"], ["smtp"]],
  [["80"], ["443"], ["53"], ["22"], ["21"]],
  [["ping"], ["ip", "alamat ip"], ["kabel", "konektor"], ["ipconfig"], ["dns"]],
  [["switch"], ["wan"], ["dhcp"], ["dns"], ["router"]]
];

const ESSAY_KEYWORDS = [
  ["jaringan", "perangkat", "data", "berbagi", "terhubung"],
  ["lan", "man", "wan", "wilayah", "jaringan"],
  ["router", "switch", "hub", "access point", "fungsi"],
  ["topologi", "star", "bus", "ring", "mesh"],
  ["kabel", "utp", "stp", "fiber", "rj45"],
  ["ip", "alamat", "subnet", "network", "host"],
  ["tcp", "udp", "dns", "dhcp", "protokol"],
  ["port", "layanan", "http", "https", "dns"],
  ["koneksi", "ping", "gateway", "dns", "kabel"],
  ["jaringan", "router", "switch", "ip", "dns"]
];

function fail(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  throw error;
}

function normalizeUsername(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function cleanInput(value, maxLength, label) {
  const text = String(value || "").trim();
  if (!text || text.length > maxLength) fail(label + " wajib diisi (maksimal " + maxLength + " karakter).");
  if (/^[=+\-@]/.test(text)) fail(label + " tidak boleh diawali karakter formula.");
  return text;
}

function safeText(value, maxLength) {
  let text = String(value || "").trim().slice(0, maxLength);
  if (/^[=+\-@]/.test(text)) text = "'" + text;
  return text;
}

function normalizeAnswer(value) {
  return String(value || "").toLowerCase().trim()
    .replace(/[.,!?;:'"]/g, "")
    .replace(/\s+/g, " ");
}

function hashPassword(password, salt) {
  let digest = crypto.createHash("sha256").update(salt + ":" + password).digest();
  for (let index = 0; index < 5000; index++) {
    digest = crypto.createHash("sha256").update(digest).digest();
  }
  return digest.toString("base64");
}

function constantTimeEqual(left, right) {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function playerRowIndex(rows, username) {
  return rows.findIndex(row => String(row[0]) === username);
}

function answerFromRow(row) {
  return {
    id: String(row[0]),
    level: Number(row[2]),
    stage: Number(row[3]),
    question: Number(row[4]),
    answer: String(row[5]),
    correct: row[6] === true || String(row[6]).toLowerCase() === "true",
    points: Number(row[7]) || 0,
    status: String(row[8]),
    date: String(row[9])
  };
}

function makePlayer(row, answers, includeAnswers = true) {
  const totalAnswers = answers.length;
  const progress = {};
  for (let level = 0; level < 10; level++) {
    const count = Math.max(0, Math.min(15, totalAnswers - level * 15));
    const completed = count === 15;
    progress[level] = {
      stage: completed ? 3 : Math.floor(count / 5),
      index: completed ? 5 : count % 5,
      completed,
      pendingEssay: false
    };
  }
  return {
    username: String(row[0]),
    name: String(row[1]),
    kelas: String(row[2]),
    role: "participant",
    avatar: Number(row[5]) || 0,
    xp: answers.reduce((sum, item) => sum + item.points, 0),
    progress,
    violations: Number(row[6]) || 0,
    terminated: row[7] === true || String(row[7]).toLowerCase() === "true",
    terminationReason: String(row[8] || ""),
    answers: includeAnswers ? answers : [],
    answeredCount: totalAnswers,
    finished: row[7] === true || String(row[7]).toLowerCase() === "true" || totalAnswers >= 150
  };
}

function scoreAnswer(level, stage, question, answer) {
  const normalized = normalizeAnswer(answer);
  if (stage === 0) {
    const correct = normalized === normalizeAnswer(MCQ_ANSWER_KEYS[level][question]);
    return { correct, points: correct ? 10 : 0 };
  }
  if (stage === 1) {
    const correct = SHORT_ANSWER_KEYS[level][question]
      .some(item => normalizeAnswer(item) === normalized);
    return { correct, points: correct ? 20 : 0 };
  }
  if (normalized.length < 20) return { correct: false, points: 0 };
  const found = ESSAY_KEYWORDS[level].filter(word => normalized.includes(word)).length;
  const score = Math.round(found / ESSAY_KEYWORDS[level].length * 100);
  const correct = score >= 40;
  return { correct, points: correct ? Math.round(score * 0.3) : 0 };
}

function getSetting(rows, key) {
  const row = rows.find(item => String(item[0]) === key);
  return row ? String(row[1]) : "false";
}

async function writeSetting(key, value) {
  const rows = await readTable("Settings");
  const index = rows.findIndex(row => String(row[0]) === key);
  if (index >= 0) {
    await updateCell("Settings", index + 2, "B", String(value));
  } else {
    await appendRow("Settings", [key, String(value)]);
  }
}

async function readSession(settingsRows) {
  const rows = settingsRows || await readTable("Settings");
  return {
    sessionActive: getSetting(rows, "sessionActive") === "true",
    sessionEnded: getSetting(rows, "sessionEnded") === "true"
  };
}

function tokenHash(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function issueToken(principal) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = Date.now() + SESSION_MS;
  await appendRow("Sessions", [tokenHash(token), principal, expiresAt, false]);
  return token;
}

async function getPrincipal(token, sessionRows) {
  if (typeof token !== "string" || !token) return "";
  const rows = sessionRows || await readTable("Sessions");
  const hash = tokenHash(token);
  const row = rows.find(item => constantTimeEqual(item[0], hash));
  if (!row || row[3] === true || String(row[3]).toLowerCase() === "true" || Number(row[2]) <= Date.now()) return "";
  return String(row[1]);
}

async function requireAdmin(token, sessionRows) {
  if (await getPrincipal(token, sessionRows) !== "admin") fail("Sesi admin tidak valid. Silakan login kembali.", 401);
}

async function requirePlayer(token, sessionRows) {
  const principal = await getPrincipal(token, sessionRows);
  if (!principal.startsWith("player:")) fail("Sesi peserta tidak valid. Silakan login kembali.", 401);
  return principal.slice(7);
}

async function checkRateLimit(key) {
  const rows = await readTable("LoginAttempts");
  const index = rows.findIndex(row => String(row[0]) === key);
  if (index < 0) return;
  const attempts = Number(rows[index][1]) || 0;
  const expiresAt = Number(rows[index][2]) || 0;
  if (expiresAt > Date.now() && attempts >= MAX_LOGIN_ATTEMPTS) {
    fail("Terlalu banyak percobaan. Coba lagi dalam 10 menit.", 429);
  }
}

async function recordFailedLogin(key) {
  const rows = await readTable("LoginAttempts");
  const index = rows.findIndex(row => String(row[0]) === key);
  const now = Date.now();
  const attempts = index >= 0 && Number(rows[index][2]) > now
    ? Number(rows[index][1]) + 1
    : 1;
  const record = [key, attempts, now + 10 * 60 * 1000];
  if (index >= 0) await updateRow("LoginAttempts", index + 2, record);
  else await appendRow("LoginAttempts", record);
}

async function clearFailedLogin(key) {
  const rows = await readTable("LoginAttempts");
  const index = rows.findIndex(row => String(row[0]) === key);
  if (index >= 0) await updateRow("LoginAttempts", index + 2, [key, 0, 0]);
}

async function loadPlayer(username, tables) {
  const data = tables || await readTables(["Players", "Answers"]);
  const players = data.Players;
  const row = players.find(item => String(item[0]) === username);
  if (!row) fail("Akun peserta tidak ditemukan.");
  const answers = data.Answers.filter(item => String(item[1]) === username).map(answerFromRow);
  return makePlayer(row, answers);
}

async function participantLogin(payload) {
  const name = cleanInput(payload.name, 60, "Nama");
  const kelas = cleanInput(payload.kelas, 40, "Kelas");
  const password = String(payload.password || "");
  if (name.length < 2 || kelas.length < 2) fail("Nama dan kelas minimal 2 karakter.");
  if (password.length < 8 || password.length > 128) fail("Password harus 8-128 karakter.");

  const username = normalizeUsername(name);
  const rateKey = "player:" + username;
  await checkRateLimit(rateKey);
  const tables = await readTables(["Players", "Answers", "Settings"]);
  const players = tables.Players;
  let index = playerRowIndex(players, username);
  if (index >= 0) {
    const row = players[index];
    if (!constantTimeEqual(String(row[4]), hashPassword(password, String(row[3])))) {
      await recordFailedLogin(rateKey);
      fail("Nama atau password tidak cocok.", 401);
    }
    if (row[7] === true || String(row[7]).toLowerCase() === "true") fail("Akun ini telah dihentikan. Hubungi admin.", 403);
    await clearFailedLogin(rateKey);
  } else {
    const salt = crypto.randomUUID();
    const newRow = [
      username, safeText(name, 60), safeText(kelas, 40), salt,
      hashPassword(password, salt), 0, 0, false, "", new Date().toISOString()
    ];
    await appendRow("Players", newRow);
    players.push(newRow);
  }

  const token = await issueToken("player:" + username);
  const user = await loadPlayer(username, tables);
  const session = await readSession(tables.Settings);
  return { token, user, ...session };
}

async function adminLogin(payload) {
  const username = String(payload.username || "").trim().toLowerCase();
  const password = String(payload.password || "");
  if (username !== "admin") fail("Username atau password admin salah.", 401);

  const rateKey = "admin:" + username;
  await checkRateLimit(rateKey);
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) fail("ADMIN_PASSWORD belum diatur pada Environment Variables Vercel.", 500);
  if (!constantTimeEqual(expected, password)) {
    await recordFailedLogin(rateKey);
    fail("Username atau password admin salah.", 401);
  }
  await clearFailedLogin(rateKey);
  return { token: await issueToken("admin") };
}

async function saveAnswer(username, answer, answers, settingsRows) {
  const session = await readSession(settingsRows);
  if (!session.sessionActive || session.sessionEnded) fail("Sesi permainan sedang tidak aktif.");

  const id = String(answer.id || "");
  if (!/^[a-zA-Z0-9-]{8,80}$/.test(id)) fail("ID jawaban tidak valid.");
  const userAnswers = answers.filter(row => String(row[1]) === username);
  if (userAnswers.some(row => String(row[0]) === id)) return null;

  const answerText = String(answer.answer || "").trim();
  if (answerText.length > 5000) fail("Jawaban terlalu panjang.");
  const level = Number(answer.level);
  const stage = Number(answer.stage);
  const question = Number(answer.question);
  const alreadySaved = userAnswers.find(row =>
    Number(row[2]) === level && Number(row[3]) === stage && Number(row[4]) === question
  );
  if (alreadySaved) {
    if (String(alreadySaved[5]) === safeText(answerText, 5000)) return null;
    fail("Pertanyaan ini sudah memiliki jawaban tersimpan.");
  }

  const answerCount = userAnswers.length;
  if (answerCount >= 150) fail("Semua pertanyaan sudah dijawab.");
  const expectedLevel = Math.floor(answerCount / 15);
  const localIndex = answerCount % 15;
  const expectedStage = Math.floor(localIndex / 5);
  const expectedQuestion = localIndex % 5;
  if (level !== expectedLevel || stage !== expectedStage || question !== expectedQuestion) {
    fail("Urutan pertanyaan tidak valid. Muat ulang game dan coba lagi.");
  }

  const score = scoreAnswer(expectedLevel, expectedStage, expectedQuestion, answerText);
  const status = answerText
    ? expectedStage === 2 ? "ESSAY CHECKED" : score.correct ? "CORRECT" : "INCORRECT"
    : "TIME OUT";
  const savedRow = [
    id, username, expectedLevel, expectedStage, expectedQuestion,
    safeText(answerText, 5000), score.correct, score.points, status, new Date().toISOString()
  ];
  await appendRow("Answers", savedRow);
  return savedRow;
}

async function savePlayer(payload) {
  const tables = await readTables(["Sessions", "Players", "Answers", "Settings"]);
  const username = await requirePlayer(payload.token, tables.Sessions);
  const profile = payload.profile || {};
  if (normalizeUsername(profile.username) !== username) fail("Profil tidak cocok dengan sesi ini.");

  const players = tables.Players;
  const index = playerRowIndex(players, username);
  if (index < 0) fail("Akun peserta tidak ditemukan.");
  const row = players[index];
  const avatar = Number(profile.avatar);
  if (!Number.isInteger(avatar) || avatar < 0 || avatar > 5) fail("Avatar tidak valid.");
  await updateCell("Players", index + 2, "F", avatar);
  row[5] = avatar;

  if (payload.answer) {
    const savedAnswer = await saveAnswer(username, payload.answer, tables.Answers, tables.Settings);
    if (savedAnswer) tables.Answers.push(savedAnswer);
  }
  return { user: await loadPlayer(username, tables) };
}

async function reportViolation(payload) {
  const tables = await readTables(["Sessions", "Players", "Answers"]);
  const username = await requirePlayer(payload.token, tables.Sessions);
  const players = tables.Players;
  const index = playerRowIndex(players, username);
  if (index < 0) fail("Akun peserta tidak ditemukan.");
  const row = players[index];
  const violations = (Number(row[6]) || 0) + 1;
  const terminated = violations >= 10;
  await updateCell("Players", index + 2, "G", violations);
  await updateCell("Players", index + 2, "H", terminated);
  if (terminated) await updateCell("Players", index + 2, "I", "Batas 10 pelanggaran tercapai.");
  return { user: await loadPlayer(username, tables) };
}

async function loadAdminState(tables) {
  const data = tables || await readTables(["Players", "Answers", "Settings"]);
  const session = await readSession(data.Settings);
  const answersByUser = {};
  for (const row of data.Answers) {
    const username = String(row[1]);
    if (!answersByUser[username]) answersByUser[username] = [];
    answersByUser[username].push(answerFromRow(row));
  }
  return {
    ...session,
    users: data.Players.map(row => makePlayer(row, answersByUser[String(row[0])] || [], false))
  };
}

async function adminSetSession(payload) {
  await requireAdmin(payload.token);
  const sessionActive = payload.active === true;
  const sessionEnded = payload.ended === true;
  await writeSetting("sessionActive", sessionActive);
  await writeSetting("sessionEnded", sessionEnded);
  return { sessionActive, sessionEnded };
}

async function adminReset(payload) {
  await requireAdmin(payload.token);
  await Promise.all([clearDataRows("Players"), clearDataRows("Answers")]);
  await writeSetting("sessionActive", false);
  await writeSetting("sessionEnded", false);
  return { reset: true };
}

async function logout(payload) {
  if (!payload.token) return { loggedOut: true };
  const rows = await readTable("Sessions");
  const hash = tokenHash(String(payload.token));
  const index = rows.findIndex(row => constantTimeEqual(row[0], hash));
  if (index >= 0) await updateCell("Sessions", index + 2, "D", true);
  return { loggedOut: true };
}

async function handleAction(action, payload = {}) {
  switch (action) {
    case "getSession": {
      const tables = await readTables(["Sessions", "Settings", "Players"]);
      const principal = await getPrincipal(payload.token, tables.Sessions);
      const session = await readSession(tables.Settings);
      const username = principal.startsWith("player:") ? principal.slice(7) : "";
      return {
        ...session,
        playerExists: !payload.token || principal === "admin" ||
          Boolean(username && tables.Players.some(row => String(row[0]) === username))
      };
    }
    case "participantLogin": return participantLogin(payload);
    case "adminLogin": return adminLogin(payload);
    case "adminLoad": {
      const tables = await readTables(["Sessions", "Players", "Answers", "Settings"]);
      await requireAdmin(payload.token, tables.Sessions);
      return loadAdminState(tables);
    }
    case "savePlayer": return savePlayer(payload);
    case "reportViolation": return reportViolation(payload);
    case "adminSetSession": return adminSetSession(payload);
    case "adminReset": return adminReset(payload);
    case "logout": return logout(payload);
    default: fail("Permintaan tidak dikenal.");
  }
}

module.exports = { handleAction };
