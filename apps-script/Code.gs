const SHEET_HEADERS = {
  Players: ["username", "name", "kelas", "passwordSalt", "passwordHash", "avatar", "violations", "terminated", "terminationReason", "createdAt"],
  Answers: ["id", "username", "level", "stage", "question", "answer", "correct", "points", "status", "date"],
  Settings: ["key", "value"]
};

const SESSION_CACHE_SECONDS = 21600;
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

function doGet(event) {
  if (event && event.parameter && event.parameter.bridge === "1") {
    const bridgeHtml = `<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <meta charset="utf-8">
</head>
<body>
<script>
  window.top.postMessage({ channel: "crimson-sheets-ready" }, "*");

  window.addEventListener("message", event => {
    if (event.source !== window.top || !event.data || event.data.channel !== "crimson-sheets") return;

    const request = event.data;
    google.script.run
      .withSuccessHandler(result => window.top.postMessage({
        channel: "crimson-sheets-result",
        id: request.id,
        result
      }, "*"))
      .withFailureHandler(error => window.top.postMessage({
        channel: "crimson-sheets-result",
        id: request.id,
        error: error && error.message ? error.message : "Permintaan gagal diproses."
      }, "*"))
      .handleClientRequest(request.action, request.payload);
  });
</script>
</body>
</html>`;

    return HtmlService.createHtmlOutput(bridgeHtml)
      .setTitle("Crimson Sheets Bridge")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  return HtmlService.createHtmlOutput("Crimson Protocol Sheets API is running.");
}

function setupCrimsonSheets() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) throw new Error("Buka Apps Script dari Google Sheet yang akan digunakan.");

  PropertiesService.getScriptProperties().setProperty("SHEET_ID", spreadsheet.getId());

  Object.keys(SHEET_HEADERS).forEach(name => {
    let sheet = spreadsheet.getSheetByName(name);
    if (!sheet) sheet = spreadsheet.insertSheet(name);
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, SHEET_HEADERS[name].length).setValues([SHEET_HEADERS[name]]);
      sheet.setFrozenRows(1);
    }
  });

  const settings = spreadsheet.getSheetByName("Settings");
  const existingKeys = settings.getLastRow() > 1
    ? settings.getRange(2, 1, settings.getLastRow() - 1, 1).getValues().flat()
    : [];
  ["sessionActive", "sessionEnded"].forEach(key => {
    if (!existingKeys.includes(key)) settings.appendRow([key, "false"]);
  });

  return spreadsheet.getUrl();
}

function handleClientRequest(action, payload) {
  payload = payload || {};

  switch (action) {
    case "getSession":
      return getSession_(payload.token);
    case "participantLogin":
      return participantLogin_(payload);
    case "adminLogin":
      return adminLogin_(payload);
    case "adminLoad":
      requireAdmin_(payload.token);
      return loadAdminState_();
    case "savePlayer":
      return savePlayer_(payload);
    case "reportViolation":
      return reportViolation_(payload);
    case "adminSetSession":
      requireAdmin_(payload.token);
      return setSession_(payload.active, payload.ended);
    case "adminReset":
      requireAdmin_(payload.token);
      return resetData_();
    case "logout":
      if (payload.token) CacheService.getScriptCache().remove("auth:" + payload.token);
      return { loggedOut: true };
    default:
      throw new Error("Permintaan tidak dikenal.");
  }
}

function participantLogin_(payload) {
  const name = cleanInput_(payload.name, 60, "Nama");
  const kelas = cleanInput_(payload.kelas, 40, "Kelas");
  const password = String(payload.password || "");
  if (name.length < 2 || kelas.length < 2) throw new Error("Nama dan kelas minimal 2 karakter.");
  if (password.length < 8 || password.length > 128) throw new Error("Password harus 8-128 karakter.");

  const username = normalizeUsername_(name);
  checkRateLimit_("player:" + username);

  const result = withScriptLock_(() => {
    const sheet = getSheet_("Players");
    const rowIndex = findPlayerRow_(sheet, username);
    let row;

    if (rowIndex) {
      row = sheet.getRange(rowIndex, 1, 1, SHEET_HEADERS.Players.length).getValues()[0];
      const salt = String(row[3]);
      if (!constantTimeEqual_(String(row[4]), hashPassword_(password, salt))) {
        recordFailedLogin_("player:" + username);
        throw new Error("Nama atau password tidak cocok.");
      }
      if (row[7] === true) throw new Error("Akun ini telah dihentikan. Hubungi admin.");
      CacheService.getScriptCache().remove("login-fail:player:" + username);
    } else {
      const salt = Utilities.getUuid();
      row = [username, safeText_(name, 60), safeText_(kelas, 40), salt,
        hashPassword_(password, salt), 0, 0, false, "", new Date().toISOString()];
      sheet.appendRow(row);
    }

    const token = issueToken_("player:" + username);
    const session = readSession_();
    return {
      token,
      user: loadPlayer_(username),
      sessionActive: session.sessionActive,
      sessionEnded: session.sessionEnded
    };
  });

  return result;
}

function adminLogin_(payload) {
  const username = String(payload.username || "").trim().toLowerCase();
  const password = String(payload.password || "");
  if (username !== "admin") throw new Error("Username atau password admin salah.");

  checkRateLimit_("admin:" + username);
  const expected = PropertiesService.getScriptProperties().getProperty("ADMIN_PASSWORD");
  if (!expected) throw new Error("ADMIN_PASSWORD belum diatur pada Script Properties.");
  if (!constantTimeEqual_(expected, password)) {
    recordFailedLogin_("admin:" + username);
    throw new Error("Username atau password admin salah.");
  }

  CacheService.getScriptCache().remove("login-fail:admin:" + username);
  return { token: issueToken_("admin") };
}

function getSession_(token) {
  const principal = getPrincipal_(token);
  const session = readSession_();
  return {
    sessionActive: session.sessionActive,
    sessionEnded: session.sessionEnded,
    playerExists: !token || principal === "admin"
      ? true
      : principal.indexOf("player:") === 0 &&
        Boolean(findPlayerRow_(getSheet_("Players"), principal.slice(7)))
  };
}

function savePlayer_(payload) {
  const username = requirePlayer_(payload.token);
  const profile = payload.profile || {};
  if (normalizeUsername_(profile.username) !== username) throw new Error("Profil tidak cocok dengan sesi ini.");

  return withScriptLock_(() => {
    const sheet = getSheet_("Players");
    const rowIndex = findPlayerRow_(sheet, username);
    if (!rowIndex) throw new Error("Akun peserta tidak ditemukan.");

    const avatar = Number(profile.avatar);
    if (!Number.isInteger(avatar) || avatar < 0 || avatar > 5) throw new Error("Avatar tidak valid.");
    sheet.getRange(rowIndex, 6).setValue(avatar);

    if (payload.answer) saveAnswer_(username, payload.answer);
    return { user: loadPlayer_(username) };
  });
}

function saveAnswer_(username, answer) {
  const session = readSession_();
  if (!session.sessionActive || session.sessionEnded) throw new Error("Sesi permainan sedang tidak aktif.");

  const id = String(answer.id || "");
  if (!/^[a-zA-Z0-9-]{8,80}$/.test(id)) throw new Error("ID jawaban tidak valid.");

  const sheet = getSheet_("Answers");
  const values = sheet.getLastRow() > 1
    ? sheet.getRange(2, 1, sheet.getLastRow() - 1, SHEET_HEADERS.Answers.length).getValues()
    : [];
  const userAnswers = values.filter(row => String(row[1]) === username);
  if (userAnswers.some(row => String(row[0]) === id)) return;

  const answerText = String(answer.answer || "").trim();
  if (answerText.length > 5000) throw new Error("Jawaban terlalu panjang.");
  const submittedLevel = Number(answer.level);
  const submittedStage = Number(answer.stage);
  const submittedQuestion = Number(answer.question);
  const alreadySaved = userAnswers.find(row =>
    Number(row[2]) === submittedLevel && Number(row[3]) === submittedStage &&
    Number(row[4]) === submittedQuestion
  );

  if (alreadySaved) {
    if (String(alreadySaved[5]) === safeText_(answerText, 5000)) return;
    throw new Error("Pertanyaan ini sudah memiliki jawaban tersimpan.");
  }

  const answerCount = userAnswers.length;
  if (answerCount >= 150) throw new Error("Semua pertanyaan sudah dijawab.");
  const expectedLevel = Math.floor(answerCount / 15);
  const localIndex = answerCount % 15;
  const expectedStage = Math.floor(localIndex / 5);
  const expectedQuestion = localIndex % 5;

  if (Number(answer.level) !== expectedLevel || Number(answer.stage) !== expectedStage ||
      Number(answer.question) !== expectedQuestion) {
    throw new Error("Urutan pertanyaan tidak valid. Muat ulang game dan coba lagi.");
  }

  const score = scoreAnswer_(expectedLevel, expectedStage, expectedQuestion, answerText);
  const status = answerText
    ? expectedStage === 2 ? "ESSAY CHECKED" : score.correct ? "CORRECT" : "INCORRECT"
    : "TIME OUT";

  sheet.appendRow([
    id,
    username,
    expectedLevel,
    expectedStage,
    expectedQuestion,
    safeText_(answerText, 5000),
    score.correct,
    score.points,
    status,
    new Date().toISOString()
  ]);
}

function scoreAnswer_(level, stage, question, answer) {
  const normalized = normalizeAnswer_(answer);

  if (stage === 0) {
    const correct = normalized === normalizeAnswer_(MCQ_ANSWER_KEYS[level][question]);
    return { correct, points: correct ? 10 : 0 };
  }

  if (stage === 1) {
    const correct = SHORT_ANSWER_KEYS[level][question]
      .some(item => normalizeAnswer_(item) === normalized);
    return { correct, points: correct ? 20 : 0 };
  }

  if (normalized.length < 20) return { correct: false, points: 0 };
  const text = normalized;
  const found = ESSAY_KEYWORDS[level].filter(word => text.includes(word)).length;
  const score = Math.round(found / ESSAY_KEYWORDS[level].length * 100);
  const correct = score >= 40;
  return { correct, points: correct ? Math.round(score * 0.3) : 0 };
}

function normalizeAnswer_(value) {
  return String(value || "").toLowerCase().trim()
    .replace(/[.,!?;:'"]/g, "")
    .replace(/\s+/g, " ");
}

function reportViolation_(payload) {
  const username = requirePlayer_(payload.token);
  return withScriptLock_(() => {
    const sheet = getSheet_("Players");
    const rowIndex = findPlayerRow_(sheet, username);
    if (!rowIndex) throw new Error("Akun peserta tidak ditemukan.");

    const violationsCell = sheet.getRange(rowIndex, 7);
    const violations = Number(violationsCell.getValue() || 0) + 1;
    const terminated = violations >= 10;
    violationsCell.setValue(violations);
    sheet.getRange(rowIndex, 8).setValue(terminated);
    if (terminated) sheet.getRange(rowIndex, 9).setValue("Batas 10 pelanggaran tercapai.");

    return { user: loadPlayer_(username) };
  });
}

function setSession_(active, ended) {
  return withScriptLock_(() => {
    const sessionActive = active === true;
    const sessionEnded = ended === true;
    writeSetting_("sessionActive", sessionActive);
    writeSetting_("sessionEnded", sessionEnded);
    return { sessionActive, sessionEnded };
  });
}

function resetData_() {
  return withScriptLock_(() => {
    ["Players", "Answers"].forEach(name => {
      const sheet = getSheet_(name);
      if (sheet.getLastRow() > 1) {
        sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getMaxColumns()).clearContent();
      }
    });
    writeSetting_("sessionActive", false);
    writeSetting_("sessionEnded", false);
    return { reset: true };
  });
}

function loadAdminState_() {
  const session = readSession_();
  const playersSheet = getSheet_("Players");
  const answersSheet = getSheet_("Answers");
  const playerRows = playersSheet.getLastRow() > 1
    ? playersSheet.getRange(2, 1, playersSheet.getLastRow() - 1, SHEET_HEADERS.Players.length).getValues()
    : [];
  const answerRows = answersSheet.getLastRow() > 1
    ? answersSheet.getRange(2, 1, answersSheet.getLastRow() - 1, SHEET_HEADERS.Answers.length).getValues()
    : [];
  const answersByUser = {};

  answerRows.forEach(row => {
    const username = String(row[1]);
    if (!answersByUser[username]) answersByUser[username] = [];
    answersByUser[username].push(answerFromRow_(row));
  });

  return {
    sessionActive: session.sessionActive,
    sessionEnded: session.sessionEnded,
    users: playerRows.map(row => makePlayer_(row, answersByUser[String(row[0])] || [], false))
  };
}

function loadPlayer_(username) {
  const rowIndex = findPlayerRow_(getSheet_("Players"), username);
  if (!rowIndex) throw new Error("Akun peserta tidak ditemukan.");
  const row = getSheet_("Players").getRange(rowIndex, 1, 1, SHEET_HEADERS.Players.length).getValues()[0];
  return makePlayer_(row, readAnswers_(username));
}

function makePlayer_(row, answers, includeAnswers = true) {
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
    terminated: row[7] === true,
    terminationReason: String(row[8] || ""),
    answers: includeAnswers ? answers : [],
    answeredCount: totalAnswers,
    finished: row[7] === true || totalAnswers >= 150
  };
}

function readAnswers_(username) {
  const sheet = getSheet_("Answers");
  if (sheet.getLastRow() <= 1) return [];
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, SHEET_HEADERS.Answers.length).getValues()
    .filter(row => String(row[1]) === username)
    .map(answerFromRow_);
}

function answerFromRow_(row) {
  return {
    id: String(row[0]),
    level: Number(row[2]),
    stage: Number(row[3]),
    question: Number(row[4]),
    answer: String(row[5]),
    correct: row[6] === true,
    points: Number(row[7]) || 0,
    status: String(row[8]),
    date: String(row[9])
  };
}

function readSession_() {
  return {
    sessionActive: readSetting_("sessionActive") === "true",
    sessionEnded: readSetting_("sessionEnded") === "true"
  };
}

function readSetting_(key) {
  const sheet = getSheet_("Settings");
  if (sheet.getLastRow() <= 1) return "false";
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
  const row = rows.find(item => String(item[0]) === key);
  return row ? String(row[1]) : "false";
}

function writeSetting_(key, value) {
  const sheet = getSheet_("Settings");
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    const rows = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
    const index = rows.findIndex(row => String(row[0]) === key);
    if (index >= 0) {
      sheet.getRange(index + 2, 2).setValue(String(value));
      return;
    }
  }
  sheet.appendRow([key, String(value)]);
}

function getSpreadsheet_() {
  const id = PropertiesService.getScriptProperties().getProperty("SHEET_ID");
  if (!id) throw new Error("Jalankan setupCrimsonSheets() terlebih dahulu.");
  return SpreadsheetApp.openById(id);
}

function getSheet_(name) {
  const sheet = getSpreadsheet_().getSheetByName(name);
  if (!sheet) throw new Error("Tab " + name + " belum dibuat. Jalankan setupCrimsonSheets().");
  return sheet;
}

function findPlayerRow_(sheet, username) {
  if (sheet.getLastRow() <= 1) return 0;
  const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
  const index = values.findIndex(row => String(row[0]) === username);
  return index < 0 ? 0 : index + 2;
}

function normalizeUsername_(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function cleanInput_(value, maxLength, label) {
  const text = String(value || "").trim();
  if (!text || text.length > maxLength) throw new Error(label + " wajib diisi (maksimal " + maxLength + " karakter).");
  if (/^[=+\-@]/.test(text)) throw new Error(label + " tidak boleh diawali karakter formula.");
  return text;
}

function safeText_(value, maxLength) {
  let text = String(value || "").trim().slice(0, maxLength);
  if (/^[=+\-@]/.test(text)) text = "'" + text;
  return text;
}

function hashPassword_(password, salt) {
  let digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, salt + ":" + password);
  for (let index = 0; index < 5000; index++) {
    digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, digest);
  }
  return Utilities.base64Encode(digest);
}

function constantTimeEqual_(left, right) {
  left = String(left);
  right = String(right);
  let difference = left.length ^ right.length;
  const length = Math.max(left.length, right.length);
  for (let index = 0; index < length; index++) {
    difference |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }
  return difference === 0;
}

function checkRateLimit_(key) {
  const cache = CacheService.getScriptCache();
  const attempts = Number(cache.get("login-fail:" + key) || 0);
  if (attempts >= MAX_LOGIN_ATTEMPTS) throw new Error("Terlalu banyak percobaan. Coba lagi dalam 10 menit.");
}

function recordFailedLogin_(key) {
  const cache = CacheService.getScriptCache();
  const cacheKey = "login-fail:" + key;
  const attempts = Number(cache.get(cacheKey) || 0) + 1;
  cache.put(cacheKey, String(attempts), 600);
}

function issueToken_(principal) {
  const token = Utilities.getUuid().replace(/-/g, "") + Utilities.getUuid().replace(/-/g, "");
  CacheService.getScriptCache().put("auth:" + token, principal, SESSION_CACHE_SECONDS);
  return token;
}

function getPrincipal_(token) {
  if (!token || typeof token !== "string") return "";
  return CacheService.getScriptCache().get("auth:" + token) || "";
}

function requireAdmin_(token) {
  if (getPrincipal_(token) !== "admin") throw new Error("Sesi admin tidak valid. Silakan login kembali.");
}

function requirePlayer_(token) {
  const principal = getPrincipal_(token);
  if (!principal || principal.indexOf("player:") !== 0) throw new Error("Sesi peserta tidak valid. Silakan login kembali.");
  return principal.slice(7);
}

function withScriptLock_(callback) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    return callback();
  } finally {
    lock.releaseLock();
  }
}
