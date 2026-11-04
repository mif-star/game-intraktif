
/* =========================================
   IOT THEORY — CRIMSON PROTOCOL
   MAIN GAME SYSTEM
========================================= */
const SHEETS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwRj2ydtj_Ny2Su4u7SMUjSfirA5wMQZ2pDvmsqdlEKcNBnuW74VgrI3xbEkXknPiBh/exec"

const AVATARS = [
  ["👾", "PIXEL GHOST"],
  ["🥷", "CYBER NINJA"],
  ["🦇", "DARK PHANTOM"],
  ["🤖", "NETWORK BOT"],
  ["🧑‍🚀", "RED OPERATOR"],
  ["🕵️", "BYTE HUNTER"]
];

const LEVELS = [
  ["First Connection", "Pengertian jaringan komputer"],
  ["Network Types", "LAN, MAN, WAN, dan PAN"],
  ["Device Hunters", "Router, switch, hub, dan access point"],
  ["Topology Maze", "Topologi jaringan"],
  ["Cable Protocol", "Kabel jaringan dan konektor"],
  ["IP Discovery", "IP address dan subnet mask"],
  ["Protocol Secrets", "Protokol jaringan"],
  ["Port Detective", "Port dan layanan jaringan"],
  ["Troubleshooting", "Analisis masalah koneksi"],
  ["Final Network Mission", "Studi kasus jaringan"]
];

/* BANK PILIHAN GANDA */

const MCQ = [
  [
    ["Apa kepanjangan LAN?", ["Local Area Network", "Large Access Network", "Long Area Node", "Local Access Node"], 0],
    ["Jaringan komputer adalah...", ["Dua atau lebih perangkat yang saling terhubung", "Satu komputer tanpa koneksi", "Aplikasi gambar", "Perangkat pencetak"], 0],
    ["Tujuan utama jaringan komputer adalah...", ["Berbagi data dan sumber daya", "Memperbesar monitor", "Menghapus sistem operasi", "Mengganti prosesor"], 0],
    ["Perangkat yang terhubung dalam jaringan disebut...", ["Node", "Pixel", "Folder", "Browser"], 0],
    ["Contoh manfaat jaringan di sekolah adalah...", ["Berbagi printer dan file", "Mengubah warna layar", "Mempercepat kipas", "Mengisi baterai"], 0]
  ],
  [
    ["LAN mencakup wilayah...", ["Kecil atau lokal", "Antarbenua", "Seluruh dunia saja", "Antargalaksi"], 0],
    ["MAN biasanya mencakup wilayah...", ["Kota", "Satu meja", "Satu ruangan", "Satu perangkat"], 0],
    ["WAN adalah singkatan dari...", ["Wide Area Network", "Wireless Access Node", "Web Area Name", "Wide Analog Network"], 0],
    ["PAN merupakan jaringan...", ["Personal Area Network", "Public Access Network", "Private Analog Node", "Personal Address Number"], 0],
    ["Internet merupakan contoh jaringan dengan cakupan...", ["Sangat luas", "Satu ruangan", "Satu meja", "Satu perangkat"], 0]
  ],
  [
    ["Perangkat yang menghubungkan jaringan berbeda adalah...", ["Router", "Keyboard", "Monitor", "Mouse"], 0],
    ["Switch umumnya menghubungkan perangkat dalam...", ["LAN", "Jaringan listrik", "Sistem audio", "Layar"], 0],
    ["Access point menyediakan koneksi...", ["Nirkabel atau Wi-Fi", "HDMI", "VGA", "Serial"], 0],
    ["Hub mengirim data masuk ke...", ["Semua port", "Satu port tujuan saja", "Printer saja", "Internet saja"], 0],
    ["NIC merupakan singkatan dari...", ["Network Interface Card", "Network Internet Cable", "Node Internal Connection", "New Interface Control"], 0]
  ],
  [
    ["Topologi dengan perangkat pusat adalah...", ["Star", "Bus", "Ring", "Linear"], 0],
    ["Topologi bus menggunakan...", ["Kabel backbone utama", "Perangkat pusat", "Cincin tertutup", "Koneksi tanpa media"], 0],
    ["Topologi ring berbentuk...", ["Lingkaran", "Bintang", "Pohon", "Garis lurus"], 0],
    ["Topologi mesh memiliki...", ["Banyak jalur antarnode", "Satu kabel utama", "Satu perangkat pusat", "Tidak memiliki koneksi"], 0],
    ["Kelebihan topologi star adalah...", ["Kerusakan satu kabel klien tidak selalu memutus klien lain", "Tidak membutuhkan switch", "Tidak menggunakan kabel", "Selalu paling murah"], 0]
  ],
  [
    ["Kabel UTP memiliki...", ["4 pasang kabel", "2 kabel", "1 serat kaca", "8 konektor"], 0],
    ["Konektor yang umum dipakai pada kabel Ethernet UTP adalah...", ["RJ45", "USB-C", "HDMI", "VGA"], 0],
    ["Fiber optik mengirim data menggunakan...", ["Cahaya", "Gelombang suara", "Air", "Arus mekanis"], 0],
    ["STP memiliki pelindung untuk mengurangi...", ["Gangguan elektromagnetik", "Ukuran file", "Panjang IP", "Konsumsi monitor"], 0],
    ["Alat untuk memasang konektor RJ45 disebut...", ["Crimping tool", "Obeng", "Tang kuku", "Multimeter audio"], 0]
  ],
  [
    ["IP address berfungsi sebagai...", ["Identitas alamat perangkat di jaringan", "Nama aplikasi", "Jenis kabel", "Kapasitas RAM"], 0],
    ["IPv4 memiliki panjang...", ["32 bit", "64 bit", "128 bit", "16 bit"], 0],
    ["Subnet mask membantu menentukan...", ["Bagian network dan host", "Nama pengguna", "Kecepatan kipas", "Jenis monitor"], 0],
    ["Contoh alamat IPv4 adalah...", ["192.168.1.10", "www.sekolah.id", "AB:CD:EF", "192.168"], 0],
    ["192.168.1.10 termasuk alamat IP...", ["Private", "Public", "Broadcast global", "Multicast"], 0]
  ],
  [
    ["TCP dikenal sebagai protokol yang...", ["Andal dan berorientasi koneksi", "Selalu tanpa koneksi", "Hanya untuk gambar", "Tidak mengirim data"], 0],
    ["DNS berfungsi untuk...", ["Menerjemahkan nama domain ke alamat IP", "Memberi daya router", "Membuat kabel", "Menghapus cache"], 0],
    ["DHCP digunakan untuk...", ["Memberikan konfigurasi IP otomatis", "Mengirim email", "Membuka gambar", "Mengatur resolusi"], 0],
    ["HTTP digunakan untuk komunikasi...", ["Web", "Printer USB", "Bluetooth audio", "BIOS"], 0],
    ["UDP memiliki karakteristik...", ["Tanpa koneksi dan overhead rendah", "Selalu menjamin pengiriman", "Hanya untuk fiber", "Tidak dapat mengirim paket"], 0]
  ],
  [
    ["Port standar HTTP adalah...", ["80", "21", "22", "443"], 0],
    ["Port standar HTTPS adalah...", ["443", "80", "25", "110"], 0],
    ["Port standar DNS adalah...", ["53", "23", "8080", "3389"], 0],
    ["Port standar SSH adalah...", ["22", "21", "80", "161"], 0],
    ["Port standar FTP control adalah...", ["21", "53", "443", "67"], 0]
  ],
  [
    ["Perintah untuk menguji keterjangkauan host adalah...", ["ping", "mkdir", "copy", "format"], 0],
    ["Alamat 169.254.x.x sering menunjukkan...", ["DHCP gagal memberi alamat", "DNS berhasil", "Kabel fiber aktif", "Gateway benar"], 0],
    ["Jika lampu link port LAN mati, pemeriksaan awal adalah...", ["Kabel dan konektor", "Wallpaper", "Resolusi monitor", "Aplikasi musik"], 0],
    ["Perintah Windows untuk melihat konfigurasi IP adalah...", ["ipconfig", "dir", "cls", "mkdir"], 0],
    ["Jika IP bisa diakses tetapi domain tidak, periksa layanan...", ["DNS", "HDMI", "USB", "VGA"], 0]
  ],
  [
    ["Untuk menghubungkan banyak PC dalam satu LAN digunakan...", ["Switch", "Speaker", "Scanner", "Webcam"], 0],
    ["Dua gedung berbeda lokasi ingin terhubung. Perangkat untuk merutekan jaringan adalah...", ["Router", "Keyboard", "Hub USB", "Monitor"], 0],
    ["Agar komputer mendapat IP otomatis, layanan yang digunakan adalah...", ["DHCP", "FTP", "HTML", "SMTP"], 0],
    ["Komputer dapat membuka IP server tetapi tidak nama domain. Kemungkinan masalah ada pada...", ["DNS", "Kabel power monitor", "RAM", "Mouse"], 0],
    ["Untuk memeriksa apakah gateway merespons gunakan...", ["ping alamat-gateway", "format", "del", "mkdir"], 0]
  ]
];

/* BANK ISIAN SINGKAT */

const SHORT = [
  [["Apa kepanjangan LAN?", ["local area network", "lan"]],
   ["Jaringan komputer memungkinkan perangkat bertukar apa?", ["data", "informasi"]],
   ["Apa istilah untuk perangkat yang terhubung ke jaringan?", ["node"]],
   ["Apa nama aturan komunikasi dalam jaringan?", ["protokol"]],
   ["Sebutkan satu sumber daya yang dapat dibagikan melalui jaringan.", ["printer", "file", "data", "internet"]]],

  [["Jaringan untuk area kecil disebut?", ["lan"]],
   ["Jaringan yang mencakup wilayah kota disebut?", ["man"]],
   ["Apa kepanjangan WAN?", ["wide area network", "wan"]],
   ["Jaringan untuk perangkat pribadi jarak dekat disebut?", ["pan"]],
   ["Internet memiliki cakupan yang sangat?", ["luas", "global", "besar"]]],

  [["Perangkat untuk menghubungkan jaringan berbeda disebut?", ["router"]],
   ["Perangkat penghubung beberapa perangkat dalam LAN disebut?", ["switch"]],
   ["Perangkat yang menyediakan akses Wi-Fi disebut?", ["access point", "ap"]],
   ["Apa kepanjangan NIC?", ["network interface card", "nic"]],
   ["Perangkat yang meneruskan data ke semua port disebut?", ["hub"]]],

  [["Topologi dengan perangkat pusat disebut?", ["star", "bintang"]],
   ["Topologi yang menggunakan kabel backbone disebut?", ["bus"]],
   ["Topologi dengan banyak jalur antarnode disebut?", ["mesh"]],
   ["Topologi yang berbentuk lingkaran disebut?", ["ring"]],
   ["Perangkat pusat yang umum digunakan pada topologi star?", ["switch", "hub"]]],

  [["Berapa pasang kabel pada UTP?", ["4", "empat"]],
   ["Apa nama konektor kabel Ethernet UTP?", ["rj45"]],
   ["Media jaringan yang menggunakan cahaya disebut?", ["fiber optik", "fiber optic", "serat optik"]],
   ["STP mengurangi gangguan apa?", ["elektromagnetik", "interferensi"]],
   ["Alat untuk memasang konektor RJ45 disebut?", ["crimping tool", "tang crimping", "crimping"]]],

  [["Apa fungsi IP address?", ["alamat", "identitas"]],
   ["Berapa bit panjang IPv4?", ["32", "tiga puluh dua"]],
   ["Subnet mask membedakan network dan bagian apa?", ["host"]],
   ["192.168.1.1 termasuk jenis IP apa?", ["private", "pribadi"]],
   ["Layanan yang memberikan IP otomatis disebut?", ["dhcp"]]],

  [["Protokol transport yang andal dan berorientasi koneksi adalah?", ["tcp"]],
   ["Layanan penerjemah nama domain ke IP disebut?", ["dns"]],
   ["Layanan konfigurasi IP otomatis disebut?", ["dhcp"]],
   ["Protokol web tanpa enkripsi adalah?", ["http"]],
   ["Protokol pengiriman email adalah?", ["smtp"]]],

  [["Berapa port standar HTTP?", ["80"]],
   ["Berapa port standar HTTPS?", ["443"]],
   ["Berapa port standar DNS?", ["53"]],
   ["Berapa port standar SSH?", ["22"]],
   ["Berapa port standar FTP control?", ["21"]]],

  [["Perintah untuk menguji koneksi ke host adalah?", ["ping"]],
   ["Alamat otomatis 169.254.x.x menunjukkan DHCP gagal memberikan apa?", ["ip", "alamat ip"]],
   ["Apa yang perlu diperiksa pertama saat link LAN mati?", ["kabel", "konektor"]],
   ["Perintah Windows untuk melihat konfigurasi IP adalah?", ["ipconfig"]],
   ["Layanan penerjemah domain menjadi IP adalah?", ["dns"]]],

  [["Perangkat pusat koneksi PC di laboratorium adalah?", ["switch"]],
   ["Jaringan yang menghubungkan wilayah luas disebut?", ["wan"]],
   ["Layanan pembagi alamat IP otomatis adalah?", ["dhcp"]],
   ["Layanan penerjemah nama domain adalah?", ["dns"]],
   ["Perangkat penghubung jaringan berbeda adalah?", ["router"]]]
];

/* BANK ESAI */

const ESSAYS = [
  [
    "Jelaskan pengertian jaringan komputer dan sebutkan tiga manfaatnya.",
    "Mengapa berbagi sumber daya melalui jaringan membantu kegiatan sekolah?",
    "Jelaskan perbedaan server dan client dengan contoh.",
    "Mengapa jaringan komputer membutuhkan protokol?",
    "Sebuah sekolah memiliki 20 komputer. Jelaskan manfaat jika semuanya terhubung dalam jaringan."
  ],
  [
    "Jelaskan perbedaan LAN, MAN, dan WAN berdasarkan cakupan serta contohnya.",
    "Mengapa PAN disebut jaringan personal? Berikan contoh.",
    "Perusahaan memiliki kantor di tiga kota. Jenis jaringan apa yang sesuai?",
    "Bandingkan LAN dan WAN dari cakupan dan infrastrukturnya.",
    "Berikan contoh penggunaan LAN, MAN, dan WAN dalam kehidupan."
  ],
  [
    "Jelaskan perbedaan fungsi router, switch, hub, dan access point.",
    "Mengapa switch lebih efisien daripada hub?",
    "Jelaskan bagaimana router membantu jaringan lokal mengakses internet.",
    "Sebuah kelas membutuhkan Wi-Fi. Perangkat apa yang diperlukan?",
    "Apa fungsi NIC pada komputer?"
  ],
  [
    "Jelaskan cara kerja topologi star beserta kelebihan dan kekurangannya.",
    "Bandingkan topologi bus dan ring.",
    "Mengapa topologi mesh memiliki banyak jalur komunikasi?",
    "Apa dampak jika perangkat pusat topologi star rusak?",
    "Pilih topologi yang sesuai untuk laboratorium komputer dan jelaskan alasannya."
  ],
  [
    "Jelaskan perbedaan kabel UTP, STP, dan fiber optik.",
    "Mengapa urutan warna kabel UTP harus diperhatikan?",
    "Jelaskan fungsi konektor RJ45 dan crimping tool.",
    "Mengapa fiber optik cocok untuk komunikasi jarak jauh?",
    "Apa yang harus diperiksa jika kabel UTP tidak terdeteksi?"
  ],
  [
    "Jelaskan fungsi IP address dan subnet mask.",
    "Apa perbedaan IPv4 dan IPv6?",
    "Mengapa dua perangkat dalam satu jaringan tidak boleh memakai IP yang sama?",
    "Jelaskan perbedaan IP private dan public.",
    "Apa yang harus dilakukan jika komputer tidak memperoleh IP otomatis?"
  ],
  [
    "Jelaskan perbedaan TCP dan UDP beserta contoh penggunaannya.",
    "Apa fungsi DNS dan mengapa internet membutuhkannya?",
    "Jelaskan bagaimana DHCP membantu administrator jaringan.",
    "Bandingkan HTTP dan HTTPS dari sisi keamanan.",
    "Mengapa pemilihan protokol harus disesuaikan dengan kebutuhan?"
  ],
  [
    "Apa yang dimaksud port jaringan dan mengapa port diperlukan?",
    "Jelaskan perbedaan port 80 dan 443.",
    "Apa fungsi port 53 pada layanan DNS?",
    "Apa manfaat SSH bagi administrator jaringan?",
    "Bagaimana pengetahuan port membantu teknisi memeriksa layanan web?"
  ],
  [
    "Komputer terhubung Wi-Fi tetapi tidak bisa membuka internet. Jelaskan urutan pemeriksaannya.",
    "Apa fungsi perintah ping dan bagaimana membaca hasilnya?",
    "Komputer memperoleh IP 169.254.x.x. Jelaskan kemungkinan penyebabnya.",
    "IP server dapat dibuka tetapi nama domain gagal. Analisis masalahnya.",
    "Jelaskan langkah troubleshooting ketika satu komputer tidak terhubung ke LAN."
  ],
  [
    "Rancang jaringan sekolah untuk 25 komputer, satu server, dan Wi-Fi.",
    "Dua gedung sekolah perlu terhubung. Jelaskan rancangan jaringan sederhana.",
    "Komputer memperoleh IP tetapi tidak dapat mengakses situs. Analisis penyebabnya.",
    "Jelaskan bagaimana switch, router, access point, DHCP, dan DNS bekerja bersama.",
    "Buat langkah troubleshooting saat seluruh komputer laboratorium kehilangan internet."
  ]
];

/* STATE AND SHEETS API */

let state = { users: [], sessionActive: false, sessionEnded: false };
let currentUser = null;
let pendingProfile = null;
let selectedAvatar = 0;
let playerToken = null;
let adminToken = null;
let bridgeLoadPromise = null;
let apiRequestId = 0;
let saveQueue = Promise.resolve();
let sessionRefreshBusy = false;
const pendingApiRequests = new Map();

let currentLevel = 0;
let currentStage = 0;
let currentQuestion = 0;
let timeLeft = 45;
let timerInterval = null;
let answerLocked = false;

const $ = id => document.getElementById(id);

function setConnectionStatus(message, failed = false) {
  const status = $("connectionStatus");
  status.textContent = message;
  status.classList.toggle("error", failed);
}

function loadSheetsBridge() {
  if (!SHEETS_WEB_APP_URL || SHEETS_WEB_APP_URL.includes("PASTE_YOUR_")) {
    return Promise.reject(new Error("URL Google Apps Script belum dikonfigurasi."));
  }

  if (!bridgeLoadPromise) {
    bridgeLoadPromise = new Promise((resolve, reject) => {
      const bridge = $("sheetsBridge");
      bridge.onload = resolve;
      bridge.onerror = () => reject(new Error("Jembatan Google Sheets gagal dimuat."));
      bridge.src = SHEETS_WEB_APP_URL + (SHEETS_WEB_APP_URL.includes("?") ? "&" : "?") + "bridge=1";
    });
  }

  return bridgeLoadPromise;
}

function sheetsRequest(action, payload = {}) {
  return loadSheetsBridge().then(() => new Promise((resolve, reject) => {
    const id = ++apiRequestId;
    const timeout = setTimeout(() => {
      pendingApiRequests.delete(id);
      reject(new Error("Google Sheets tidak merespons. Periksa koneksi dan deployment."));
    }, 20000);

    pendingApiRequests.set(id, { resolve, reject, timeout });
    $("sheetsBridge").contentWindow.postMessage({
      channel: "crimson-sheets",
      id,
      action,
      payload
    }, "*");
  }));
}

window.addEventListener("message", event => {
  if (event.source !== $("sheetsBridge").contentWindow) return;
  if (event.data?.channel !== "crimson-sheets-result") return;

  const request = pendingApiRequests.get(event.data.id);
  if (!request) return;

  clearTimeout(request.timeout);
  pendingApiRequests.delete(event.data.id);

  if (event.data.error) request.reject(new Error(event.data.error));
  else request.resolve(event.data.result);
});

function saveState(newAnswer = null) {
  if (!currentUser || currentUser.role !== "participant" || !playerToken) {
    return Promise.resolve();
  }

  const token = playerToken;
  const profile = {
    username: currentUser.username,
    avatar: currentUser.avatar,
    progress: currentUser.progress
  };

  saveQueue = saveQueue.catch(() => {}).then(() =>
    sheetsRequest("savePlayer", {
      token,
      profile,
      answer: newAnswer
    })
  ).then(result => {
    if (playerToken === token) {
      currentUser = result.user;
      setConnectionStatus("TERSIMPAN DI GOOGLE SHEETS");
    }
  }).catch(error => {
    setConnectionStatus("GAGAL MENYIMPAN: " + error.message, true);
    throw error;
  });

  return saveQueue;
}

function cleanText(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[.,!?;:'"]/g, "")
    .replace(/\s+/g, " ");
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

/* NAVIGATION */

function showScreen(id) {
  stopTimer();

  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  $(id).classList.add("active");

  $("logoutBtn").classList.toggle("hidden", !currentUser);

  $("modeLabel").textContent = currentUser
    ? currentUser.role === "admin" ? "ADMIN CONTROL" : "PLAYER MODE"
    : "NETWORK CTF";
}

/* PLAYER LOGIN */

async function beginCharacter() {
  const name = $("playerName").value.trim();
  const kelas = $("playerClass").value.trim();
  const password = $("playerPassword").value;

  if (!name || !kelas || !password) {
    $("loginError").textContent = "Lengkapi nama, kelas, dan password.";
    return;
  }

  try {
    const result = await sheetsRequest("participantLogin", { name, kelas, password });
    playerToken = result.token;
    pendingProfile = result.user;
    state.sessionActive = result.sessionActive;
    state.sessionEnded = result.sessionEnded;
    selectedAvatar = pendingProfile.avatar || 0;

    renderAvatarChoices();
    $("loginError").textContent = "";
    setConnectionStatus("TERHUBUNG KE GOOGLE SHEETS");
    showScreen("characters");
  } catch (error) {
    $("loginError").textContent = error.message;
  }
}

/* CHARACTER SELECT */

function renderAvatarChoices() {
  $("characterGrid").innerHTML = AVATARS.map((avatar, index) => `
    <button class="character-card ${index === selectedAvatar ? "selected" : ""}"
      onclick="chooseAvatar(${index})">
      <span>${avatar[0]}</span>
      <b>${avatar[1]}</b>
      <small>${index === selectedAvatar ? "SELECTED" : "SELECT AVATAR"}</small>
    </button>
  `).join("");
}

function chooseAvatar(index) {
  selectedAvatar = index;
  renderAvatarChoices();
}

async function confirmCharacter() {
  if (!pendingProfile) return;

  pendingProfile.avatar = selectedAvatar;
  currentUser = pendingProfile;

  try {
    await saveState();
  } catch {
    return;
  }

  $("lobbyAvatar").textContent = AVATARS[selectedAvatar][0];
  $("lobbyName").textContent = currentUser.name;
  $("lobbyClass").textContent = currentUser.kelas;

  updateLobby();
  showScreen("lobby");
}

/* ADMIN LOGIN */

async function loginAdmin() {
  const username = $("adminUsername").value;
  const password = $("adminPassword").value;
  const errorMessage = $("adminLoginError");
  errorMessage.textContent = "";

  try {
    const result = await sheetsRequest("adminLogin", { username, password });
    adminToken = result.token;
    currentUser = { role: "admin", name: "Administrator" };
    await refreshAdminData();
    setConnectionStatus("ADMIN TERHUBUNG KE GOOGLE SHEETS");
    showScreen("admin");
  } catch (error) {
    errorMessage.textContent = error.message;
  }
}

async function refreshAdminData() {
  const result = await sheetsRequest("adminLoad", { token: adminToken });
  state = result;
  renderAdmin();
  updateLobby();
}

async function updateSession(active, ended) {
  try {
    const result = await sheetsRequest("adminSetSession", {
      token: adminToken,
      active,
      ended
    });
    state.sessionActive = result.sessionActive;
    state.sessionEnded = result.sessionEnded;
    await refreshAdminData();
    updateLobby();
    return true;
  } catch (error) {
    setConnectionStatus("GAGAL MEMPERBARUI SESI: " + error.message, true);
    return false;
  }
}

async function startSession() {
  if (await updateSession(true, false)) {
    alert("Sesi permainan berhasil dimulai.");
  }
}

async function endSession() {
  if (await updateSession(false, true)) {
    alert("Sesi permainan telah berakhir.");
  }
}

async function resetDemo() {
  if (!confirm("Hapus semua data peserta dan progres dari Google Sheets?")) return;

  try {
    await sheetsRequest("adminReset", { token: adminToken });
    await refreshAdminData();
    alert("Data peserta berhasil direset.");
  } catch (error) {
    setConnectionStatus("GAGAL RESET DATA: " + error.message, true);
  }
}

/* PARTICIPANT DASHBOARD */

function enterMissions() {
  if (!state.sessionActive || state.sessionEnded) {
    alert("Sesi belum dimulai oleh admin.");
    return;
  }

  renderParticipant();
  showScreen("participant");
}

function getProgress(user, level) {
  return user.progress[level] || {
    stage: 0,
    index: 0,
    completed: false,
    pendingEssay: false
  };
}

function getCompletedCount(user) {
  return Object.values(user.progress).filter(p => p.completed).length;
}

function getAnsweredCount(user) {
  return user.answeredCount ?? user.answers.length;
}

function getRank(xp) {
  if (xp >= 3000) return "NETWORK MASTER";
  if (xp >= 2000) return "PRO HACKER";
  if (xp >= 1000) return "CYBER AGENT";
  if (xp >= 300) return "OPERATOR";
  return "ROOKIE";
}

function renderParticipant() {
  if (!currentUser || currentUser.role !== "participant") return;

  $("dashName").textContent = currentUser.name;
  $("dashXP").textContent = currentUser.xp + " XP";
  $("dashAvatar").textContent = AVATARS[currentUser.avatar][0];
  $("dashCharacter").textContent = AVATARS[currentUser.avatar][1];
  $("dashClass").textContent = currentUser.kelas;
  $("dashViolations").textContent = currentUser.violations + " / 10";

  $("doneCount").textContent = getCompletedCount(currentUser) + " / 10";
  $("questionCount").textContent = getAnsweredCount(currentUser) + " / 150";
  $("rankName").textContent = getRank(currentUser.xp);

  $("missionGrid").innerHTML = LEVELS.map((level, index) => {
    const progress = getProgress(currentUser, index);
    const unlocked = index === 0 || getProgress(currentUser, index - 1).completed;
    const completed = progress.completed;

    let status = completed
      ? "✓ COMPLETED"
      : unlocked ? "UNLOCKED" : "LOCKED";

    return `
      <button class="mission-card ${completed ? "complete" : ""}"
        ${unlocked && !completed ? "" : "disabled"}
        onclick="openLevel(${index})">

        <div class="mission-number">
          <span>MISSION ${String(index + 1).padStart(2, "0")}</span>
          <span>${status}</span>
        </div>

        <h3>${level[0]}</h3>
        <p>${level[1]}</p>
        <small>15 QUESTIONS / 3 STAGES</small>
      </button>
    `;
  }).join("");
}

/* OPEN LEVEL */

function openLevel(levelIndex) {
  if (!state.sessionActive || state.sessionEnded) {
    alert("Sesi sudah tidak aktif.");
    return;
  }

  const progress = getProgress(currentUser, levelIndex);

  if (progress.completed) {
    alert("Misi ini sudah selesai.");
    return;
  }

  if (levelIndex > 0 && !getProgress(currentUser, levelIndex - 1).completed) {
    alert("Selesaikan misi sebelumnya terlebih dahulu.");
    return;
  }

  if (progress.pendingEssay) {
    alert("Jawaban esai sedang menunggu pemeriksaan admin.");
    return;
  }

  currentLevel = levelIndex;
  currentStage = progress.stage;
  currentQuestion = progress.index;

  showQuestion();
}

/* QUESTION DATA */

function getQuestion() {
  if (currentStage === 0) {
    return MCQ[currentLevel][currentQuestion];
  }

  if (currentStage === 1) {
    return SHORT[currentLevel][currentQuestion];
  }

  return ESSAYS[currentLevel][currentQuestion];
}

/* SHOW QUESTION */

function showQuestion() {
  stopTimer();
  answerLocked = false;
  timeLeft = currentStage === 2 ? 180 : 45;

  const level = LEVELS[currentLevel];
  const question = getQuestion();

  $("missionTag").textContent =
    "MISSION " + String(currentLevel + 1).padStart(2, "0");

  $("missionTitle").textContent = level[0].toUpperCase();

  $("stageName").textContent =
    "STAGE " + String(currentStage + 1).padStart(2, "0") + " / 03";

  $("questionNo").textContent =
    "QUESTION " + String(currentQuestion + 1).padStart(2, "0") + " / 05";

  $("questionText").textContent =
  typeof question === "string" ? question : question[0];

  $("difficulty").textContent =
    currentStage === 0 ? "EASY" :
    currentStage === 1 ? "MEDIUM" : "HARD";

  $("questionType").textContent =
    currentStage === 0 ? "MULTIPLE CHOICE" :
    currentStage === 1 ? "SHORT ANSWER" : "ESSAY";

  const totalProgress =
    (currentStage * 5 + currentQuestion) / 15 * 100;

  $("questionProgress").style.width = totalProgress + "%";

  $("answerFeedback").className = "feedback hidden";
  $("answerFeedback").textContent = "";

  $("submitAnswer").disabled = false;
  $("submitAnswer").textContent = "SUBMIT ANSWER →";

  if (currentStage === 0) {
    $("answerArea").innerHTML = question[1].map((option, index) => `
      <label class="answer-option">
        <input type="radio" name="answer" value="${index}">
        <b>${String.fromCharCode(65 + index)}</b>
        <span>${option}</span>
      </label>
    `).join("");
  } else if (currentStage === 1) {
    $("answerArea").innerHTML = `
      <input id="writtenAnswer" class="answer-input"
        placeholder="Ketik jawabanmu di sini...">
    `;
    } else {
    $("answerArea").innerHTML = `
      <textarea id="writtenAnswer" class="answer-textarea"
        placeholder="Tuliskan jawabanmu di sini..."></textarea>
      <p class="tiny muted">Minimal 20 karakter.</p>
    `;
  }

  $("timer").textContent = timeLeft;
  showScreen("challenge");
  startTimer();
}

/* TIMER */

function startTimer() {
  stopTimer();

  timerInterval = setInterval(() => {
    timeLeft--;
    $("timer").textContent = timeLeft;

    if (timeLeft <= 0) {
      stopTimer();
      handleTimeout();
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

async function handleTimeout() {
  if (answerLocked) return;

  answerLocked = true;

  try {
    await recordAnswer({
      answer: "",
      correct: false,
      points: 0,
      status: "TIME OUT"
    });
  } catch {
    answerLocked = false;
    showFeedback(false, "Jawaban gagal tersimpan. Periksa koneksi lalu kirim ulang.");
    return;
  }

  showFeedback(false, "Waktu habis. Jawaban dicatat salah.");
  setTimeout(nextQuestion, 1200);
}

/* ANSWER CHECKING */

function showFeedback(correct, message) {
  const box = $("answerFeedback");

  box.className = "feedback " + (correct ? "good" : "bad");
  box.textContent = message;
}

function checkShortAnswer(answer, accepted) {
  const normalized = cleanText(answer);

  return accepted.some(item => {
    const key = cleanText(item);
    return normalized === key;
  });
}

/*
  Penilaian esai berbasis kata kunci.
  Ini penilaian sederhana berbasis aturan, bukan AI.
  Admin tetap dapat mengevaluasi hasil yang meragukan.
*/

function checkEssay(answer, questionIndex) {
  const text = cleanText(answer);

  if (text.length < 20) {
    return {
      correct: false,
      score: 0,
      message: "Jawaban terlalu singkat. Tambahkan penjelasan."
    };
  }

  const keywordSets = [
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

  const required = keywordSets[currentLevel];
  const found = required.filter(word => text.includes(word));
  const ratio = found.length / required.length;

  const score = Math.round(ratio * 100);

  return {
    correct: score >= 40,
    score,
    message: score >= 40
      ? "Jawaban diterima. Skor otomatis: " + score + "/100."
      : "Kata kunci jawaban masih kurang. Skor otomatis: " + score + "/100."
  };
}

/* SUBMIT */

async function submitAnswer() {
  if (answerLocked) return;

  if (!state.sessionActive || state.sessionEnded) {
    stopTimer();
    updateLobby();
    showScreen("lobby");
    return;
  }

  let answer = "";
  let correct = false;
  let points = 0;
  let feedback = "";

  if (currentStage === 0) {
    const selected = document.querySelector('input[name="answer"]:checked');

    if (!selected) {
      alert("Pilih salah satu jawaban terlebih dahulu.");
      return;
    }

    const question = getQuestion();
    const selectedIndex = Number(selected.value);

    answer = question[1][selectedIndex];
    correct = selectedIndex === question[2];
    points = correct ? 10 : 0;

    feedback = correct
      ? "Benar! Kamu mendapatkan 10 XP."
      : "Belum tepat. Jawaban yang benar: " + question[1][question[2]];
  }

  if (currentStage === 1) {
    answer = $("writtenAnswer").value.trim();

    if (!answer) {
      alert("Isi jawaban terlebih dahulu.");
      return;
    }

    const accepted = getQuestion()[1];
    correct = checkShortAnswer(answer, accepted);
    points = correct ? 20 : 0;

    feedback = correct
      ? "Jawaban benar! Kamu mendapatkan 20 XP."
      : "Jawaban belum tepat. Coba periksa kembali konsepnya.";
  }

  if (currentStage === 2) {
    answer = $("writtenAnswer").value.trim();

    if (answer.length < 20) {
      alert("Jawaban esai minimal 20 karakter.");
      return;
    }

    const result = checkEssay(answer, currentQuestion);
    correct = result.correct;
    points = correct ? Math.round(result.score * 0.3) : 0;
    feedback = result.message;
  }

  answerLocked = true;
  stopTimer(); 
  playGameSound(correct ? "correctSound" : "wrongSound");

  try {
    await recordAnswer({
      answer,
      correct,
      points,
      status: currentStage === 2 ? "ESSAY CHECKED" : correct ? "CORRECT" : "INCORRECT"
    });
  } catch {
    answerLocked = false;
    showFeedback(false, "Jawaban gagal tersimpan. Periksa koneksi lalu kirim ulang.");
    return;
  }

  showFeedback(correct, feedback);

  setTimeout(nextQuestion, 1600);
}

/* SAVE ANSWER */

async function recordAnswer(result) {
  const answerEntry = {
    id: window.crypto?.randomUUID
      ? window.crypto.randomUUID()
      : Date.now() + "-" + Math.random().toString(36).slice(2),
    level: currentLevel,
    stage: currentStage,
    question: currentQuestion,
    answer: result.answer,
    correct: result.correct,
    points: result.points,
    status: result.status,
    date: new Date().toISOString()
  };

  currentUser.answers.push(answerEntry);

  currentUser.xp += result.points;

  try {
    await saveState(answerEntry);
  } catch (error) {
    currentUser.answers.pop();
    currentUser.xp -= result.points;
    throw error;
  }
}

/* NEXT QUESTION */

function nextQuestion() {
  currentQuestion++;

  if (currentQuestion >= 5) {
    currentQuestion = 0;
    currentStage++;
  }

  if (currentStage >= 3) {
    currentStage = 0;

    const progress = getProgress(currentUser, currentLevel);
    progress.completed = true;
    progress.stage = 3;
    progress.index = 5;

    currentUser.progress[currentLevel] = progress;

    playGameSound("levelUpSound");


    if (currentLevel === 9) {
      currentUser.finished = true;

      alert("SELAMAT! Kamu menyelesaikan seluruh misi Crimson Protocol.");
      renderParticipant();
      showScreen("finished");
      return;
    }

    alert("MISSION COMPLETED! Misi berikutnya telah terbuka.");
    renderParticipant();
    showScreen("participant");
    return;
  }

  const progress = getProgress(currentUser, currentLevel);
  progress.stage = currentStage;
  progress.index = currentQuestion;

  currentUser.progress[currentLevel] = progress;

  showQuestion();
}

/* RETURN TO DASHBOARD */

function backToMissions() {
  if (!confirm("Keluar dari misi sekarang? Progres jawaban yang sudah dikirim tetap tersimpan.")) {
    return;
  }

  stopTimer();
  renderParticipant();
  showScreen("participant");
}

/* ANTI-CHEAT MONITOR */

function registerViolation(reason) {
  if (!currentUser || currentUser.role !== "participant") return;

  if (!$("challenge").classList.contains("active")) return;

  if (currentUser.finished) return;

  sheetsRequest("reportViolation", { token: playerToken, reason })
    .then(result => {
      currentUser = result.user;
      $("dashViolations").textContent = currentUser.violations + " / 10";
      alert(
        "PELANGGARAN TERDETEKSI!\n" + reason + "\n\n" +
        "Pelanggaran: " + currentUser.violations + " / 10"
      );

      if (currentUser.terminated) {
        terminateParticipant();
      }
    })
    .catch(error => setConnectionStatus("GAGAL MENCATAT PELANGGARAN: " + error.message, true));
}

function terminateParticipant() {
  stopTimer();

  currentUser.finished = true;
  currentUser.terminated = true;
  currentUser.terminationReason = "Batas 10 pelanggaran tercapai.";

  $("finishReason").textContent =
    "Kamu mencapai batas maksimal 10 pelanggaran. Sesi peserta dihentikan.";

  showScreen("finished");
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) registerViolation("Kamu meninggalkan halaman permainan.");
});

document.addEventListener("copy", event => {
  if ($("challenge").classList.contains("active")) {
    event.preventDefault();
    registerViolation("Aktivitas menyalin soal terdeteksi.");
  }
});

document.addEventListener("cut", event => {
  if ($("challenge").classList.contains("active")) {
    event.preventDefault();
    registerViolation("Aktivitas memotong teks terdeteksi.");
  }
});

document.addEventListener("contextmenu", event => {
  if ($("challenge").classList.contains("active")) {
    event.preventDefault();
    registerViolation("Klik kanan tidak diizinkan saat mengerjakan soal.");
  }
});

document.addEventListener("keydown", event => {
  if (!$("challenge").classList.contains("active")) return;

  if ((event.ctrlKey || event.metaKey) && ["c", "x", "u", "s", "p"].includes(event.key.toLowerCase())) {
    event.preventDefault();
    registerViolation("Shortcut keyboard yang tidak diizinkan terdeteksi.");
  }
});

async function refreshSession() {
  if (!SHEETS_WEB_APP_URL || SHEETS_WEB_APP_URL.includes("PASTE_YOUR_")) return;
  if (sessionRefreshBusy) return;
  sessionRefreshBusy = true;

  try {
    const result = await sheetsRequest("getSession", { token: playerToken });
    state.sessionActive = result.sessionActive;
    state.sessionEnded = result.sessionEnded;

    if (playerToken && !result.playerExists) {
      logout();
      setConnectionStatus("AKUN TIDAK LAGI TERSEDIA DI GOOGLE SHEETS", true);
      return;
    }

    updateLobby();
    if (currentUser?.role === "participant" && $("challenge").classList.contains("active") &&
        (!state.sessionActive || state.sessionEnded)) {
      stopTimer();
      showScreen("lobby");
    }

    if (currentUser?.role === "admin") await refreshAdminData();
  } catch (error) {
    setConnectionStatus("KONEKSI GOOGLE SHEETS TERGANGGU: " + error.message, true);
  } finally {
    sessionRefreshBusy = false;
  }
}

function renderAdmin() {
  const users = state.users.filter(user => user.role === "participant");

  $("adminUsers").textContent = users.length;
  $("sessionStatus").textContent = state.sessionActive
    ? "ACTIVE" : state.sessionEnded ? "ENDED" : "WAITING";
  $("adminAnswers").textContent = users.reduce((sum, user) => sum + user.answeredCount, 0);
  $("adminViolations").textContent = users.reduce((sum, user) => sum + user.violations, 0);

  $("participantTable").innerHTML = `
    <div class="table-row head">
      <span>PLAYER</span>
      <span>XP</span>
      <span>DONE</span>
      <span>WARN</span>
    </div>
    ${
      users.length
        ? users.map(user => `
          <div class="table-row">
            <span>${AVATARS[user.avatar][0]} ${escapeHTML(user.name)}</span>
            <span>${user.xp}</span>
            <span>${getCompletedCount(user)}/10</span>
            <span>${user.violations}/10</span>
          </div>
        `).join("")
        : "<p class='muted tiny'>Belum ada peserta.</p>"
    }
  `;

  renderLeaderboard();
}

function getLeaderboard() {
  return state.users
    .filter(user => user.role === "participant")
    .sort((a, b) => b.xp - a.xp);
}

function renderLeaderboard() {
  if (!state.sessionEnded) {
    $("adminLeaderboard").innerHTML =
      "<p class='muted tiny'>Leaderboard final akan muncul setelah sesi berakhir.</p>";
    return;
  }

  const ranking = getLeaderboard();

  $("adminLeaderboard").innerHTML = ranking.length
    ? ranking.map((user, index) => `
      <div class="rank-row">
        <b>#${index + 1}</b>
        <span>${AVATARS[user.avatar][0]} ${escapeHTML(user.name)}</span>
        <strong>${user.xp} XP</strong>
      </div>
    `).join("")
    : "<p class='muted tiny'>Belum ada hasil peserta.</p>";
}

/* FINAL PODIUM */

function showPodium() {
  if (!state.sessionEnded) {
    alert("Podium hanya dapat dibuka setelah admin mengakhiri sesi.");
    return;
  }

  const ranking = getLeaderboard().slice(0, 3);

  if (!ranking.length) {
    $("podiumArea").innerHTML =
      "<p class='muted'>Belum ada peserta.</p>";
  } else {
    const positions = [
      { place: 2, user: ranking[1] },
      { place: 1, user: ranking[0] },
      { place: 3, user: ranking[2] }
    ];

    $("podiumArea").innerHTML = positions
      .filter(item => item.user)
      .map(item => `
        <div class="podium-place place-${item.place}">
          <div class="winner-avatar">
            ${AVATARS[item.user.avatar][0]}
          </div>
          <b>${escapeHTML(item.user.name)}</b>
          <small>${escapeHTML(item.user.kelas)}</small>
          <div class="podium-block">
            <strong>${item.place}</strong>
            <span>${item.user.xp} XP</span>
          </div>
        </div>
      `).join("");
  }

  showScreen("podium");
}

/* LOGOUT */

function logout() {
  stopTimer();
  const token = playerToken || adminToken;
  if (token) sheetsRequest("logout", { token }).catch(() => {});
  currentUser = null;
  pendingProfile = null;
  playerToken = null;
  adminToken = null;
  showScreen("welcome");
}

async function initializeApp() {
  setConnectionStatus("MENGHUBUNGKAN KE GOOGLE SHEETS...");

  try {
    const result = await sheetsRequest("getSession");
    state.sessionActive = result.sessionActive;
    state.sessionEnded = result.sessionEnded;
    updateLobby();
    setConnectionStatus("TERHUBUNG KE GOOGLE SHEETS");
  } catch (error) {
    setConnectionStatus("GOOGLE SHEETS BELUM TERHUBUNG: " + error.message, true);
  }
}

initializeApp();
setInterval(refreshSession, 5000);


/* =====================================
   CRIMSON AUDIO SYSTEM
===================================== */

const audioSettingsBtn =
  document.getElementById("audioSettingsBtn");

const audioPanel =
  document.getElementById("audioPanel");

const musicToggle =
  document.getElementById("musicToggle");

const sfxToggle =
  document.getElementById("sfxToggle");

const musicVolume =
  document.getElementById("musicVolume");

const sfxVolume =
  document.getElementById("sfxVolume");

const AudioContextClass = window.AudioContext || window.webkitAudioContext;
let audioContext = null;
let musicTimer = null;
let musicStep = 0;
let musicGain = null;

audioSettingsBtn.addEventListener("click", () => {
  audioPanel.classList.toggle("active");
});

function startGameMusic() {
  if (!musicToggle.checked || !AudioContextClass) return;

  audioContext ||= new AudioContextClass();
  audioContext.resume().catch(() => {});

  if (!musicGain) {
    musicGain = audioContext.createGain();
    musicGain.gain.value = Number(musicVolume.value) * 0.12;
    musicGain.connect(audioContext.destination);
  }

  if (musicTimer) return;

  const notes = [110, 164.81, 220, 164.81, 123.47, 185, 246.94, 185];
  const playNote = () => {
    if (!musicToggle.checked || !audioContext) return;

    const oscillator = audioContext.createOscillator();
    const envelope = audioContext.createGain();
    const now = audioContext.currentTime;

    oscillator.type = "triangle";
    oscillator.frequency.value = notes[musicStep % notes.length];
    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.exponentialRampToValueAtTime(0.35, now + 0.04);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);
    oscillator.connect(envelope);
    envelope.connect(musicGain);
    oscillator.start(now);
    oscillator.stop(now + 0.4);
    musicStep++;
  };

  playNote();
  musicTimer = setInterval(playNote, 480);
}

musicToggle.addEventListener("change", () => {
  if (musicToggle.checked) {
    startGameMusic();
  } else {
    clearInterval(musicTimer);
    musicTimer = null;
  }
});

musicVolume.addEventListener("input", () => {
  if (musicGain) musicGain.gain.value = Number(musicVolume.value) * 0.12;
});

function playGameSound(name) {
  if (!sfxToggle.checked || !AudioContextClass) return;

  audioContext ||= new AudioContextClass();
  audioContext.resume().catch(() => {});

  const sounds = {
    clickSound: [720],
    hoverSound: [960],
    correctSound: [660, 880],
    wrongSound: [260],
    levelUpSound: [523.25, 659.25, 783.99]
  };
  const notes = sounds[name];

  if (!notes) return;

  notes.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const envelope = audioContext.createGain();
    const now = audioContext.currentTime + index * 0.11;

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.exponentialRampToValueAtTime(
      Math.max(0.0001, Number(sfxVolume.value) * 0.12), now + 0.015
    );
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
    oscillator.connect(envelope);
    envelope.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.16);
  });
}

// Click sound
document.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (!button || button.disabled) return;
  if (button.id === "audioSettingsBtn") return;

  playGameSound("clickSound");
});

// Hover sound
document.querySelectorAll(".launcher-card").forEach(card => {
  card.addEventListener("mouseenter", () => {
    playGameSound("hoverSound");
  });
});

// Start music after user interaction
document.querySelector("#welcome .hero-copy .btn.primary")
  ?.addEventListener("click", startGameMusic);
