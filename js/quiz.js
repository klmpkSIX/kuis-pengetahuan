// === Konfigurasi Firebase ===
const firebaseConfig = {
  apiKey: "AIzaSyCoPZ1sse8vsj-ofFv-G4lXewKoC8shfMEA",
  authDomain: "kuis-pengetahuan-9816c.firebaseapp.com",
  projectId: "kuis-pengetahuan-9816c",
  storageBucket: "kuis-pengetahuan-9816c.firebasestorage.app",
  messagingSenderId: "635876306787",
  appId: "1:635876306787:web:86e5a4487628f75ec6ad56",
  measurementId: "G-T44R4GYSE5"
};

// === Inisialisasi Firebase ===
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// === Ambil nama pengguna dan pelajaran ===
const nama = localStorage.getItem("namaPengguna") || "Siswa";
document.getElementById("nama-user").textContent = `Nama: ${nama}`;

const params = new URLSearchParams(window.location.search);
const pelajaran = params.get("pelajaran") || "matematika";
document.getElementById("judul-pelajaran").textContent = pelajaran.toUpperCase();

// === Variabel global ===
let waktuTersisa = 300;
let timerInterval;
let waktuMulai;
let waktuSelesai;
let soalData = [];
let indexSoal = 0;
let skor = 0;

// === Audio ===
const suaraBenar = document.getElementById("suara-benar");
const suaraSalah = document.getElementById("suara-salah");

// === Ambil soal dari file JSON ===
fetch(`data/${pelajaran}.json`)
  .then(res => {
    if (!res.ok) throw new Error("Gagal memuat soal");
    return res.json();
  })
  .then(data => {
    soalData = data.filter(q =>
      (q.pertanyaan || q.soal) &&
      Array.isArray(q.opsi || q.pilihan) &&
      (typeof q.jawaban === "number" || typeof q.jawaban === "string")
    );

    if (soalData.length === 0) {
      document.getElementById("pertanyaan").textContent = "Belum ada soal untuk pelajaran ini.";
      return;
    }

    soalData.sort(() => Math.random() - 0.5);
    tampilSoal();
    mulaiTimer();
  })
  .catch(err => {
    document.getElementById("pertanyaan").textContent = "❌ Gagal memuat soal.";
    console.error(err);
  });

// === Timer ===
function mulaiTimer() {
  const timerDisplay = document.getElementById("timer");
  waktuMulai = Date.now();
  tampilkanWaktu(timerDisplay);

  timerInterval = setInterval(() => {
    waktuTersisa--;
    tampilkanWaktu(timerDisplay);

    if (waktuTersisa <= 0) {
      clearInterval(timerInterval);
      tampilHasil();
    }
  }, 1000);
}

function tampilkanWaktu(el) {
  const menit = Math.floor(waktuTersisa / 60);
  const detik = waktuTersisa % 60;
  el.textContent = `Waktu: ${menit}:${detik.toString().padStart(2, "0")}`;
}

// === Tampilkan soal ===
function tampilSoal() {
  const indikator = document.getElementById("indikator-soal");
  const pertanyaan = document.getElementById("pertanyaan");
  const opsiContainer = document.getElementById("opsi-container");

  if (indexSoal >= soalData.length) {
    tampilHasil();
    return;
  }

  const q = soalData[indexSoal];
  if (!q || !(q.opsi || q.pilihan)) {
    indexSoal++;
    tampilSoal();
    return;
  }

  indikator.textContent = `Soal ${indexSoal + 1} dari ${soalData.length}`;
  pertanyaan.textContent = q.pertanyaan || q.soal;
  opsiContainer.innerHTML = "";

  (q.opsi || q.pilihan).forEach((teks, i) => {
    const btn = document.createElement("button");
    btn.textContent = teks;
    btn.onclick = () => periksaJawaban(i);
    opsiContainer.appendChild(btn);
  });

  document.getElementById("btn-berikutnya").classList.add("hidden");
}

// === Periksa jawaban ===
function periksaJawaban(i) {
  const q = soalData[indexSoal];
  const benarIndex = typeof q.jawaban === "number"
    ? q.jawaban
    : (q.opsi || q.pilihan).indexOf(q.jawaban);

  const semuaTombol = document.querySelectorAll("#opsi-container button");
  semuaTombol.forEach((btn, idx) => {
    if (idx === benarIndex) btn.classList.add("benar");
    else if (idx === i) btn.classList.add("salah");
    btn.disabled = true;
  });

  if (i === benarIndex) {
    skor++;
    waktuTersisa += 2;
    suaraBenar.play();
  } else {
    suaraSalah.play();
  }

  document.getElementById("btn-berikutnya").classList.remove("hidden");
}

function soalBerikutnya() {
  indexSoal++;
  document.getElementById("btn-berikutnya").classList.add("hidden");
  if (indexSoal < soalData.length) tampilSoal();
  else tampilHasil();
}

// === Hasil akhir ===
function tampilHasil() {
  clearInterval(timerInterval);
  waktuSelesai = Date.now();

  const waktuPengerjaan = Math.round((waktuSelesai - waktuMulai) / 1000);
  const bonusWaktu = waktuTersisa / 20;
  const nilaiAkhir = Math.min(100, Math.round((skor / soalData.length * 100) + bonusWaktu));

  document.getElementById("quiz-box").classList.add("hidden");
  document.getElementById("hasil").classList.remove("hidden");
  document.getElementById("skor").textContent = `${skor} dari ${soalData.length}`;
  document.getElementById("waktu-akhir").textContent = `${waktuPengerjaan} detik`;
  document.getElementById("nilai-akhir").textContent = nilaiAkhir;

  simpanSkor(nama, pelajaran, nilaiAkhir, soalData.length, waktuPengerjaan);
}

// === Simpan skor ke Firestore ===
async function simpanSkor(nama, pelajaran, skor, total, durasi) {
  try {
    await db.collection("leaderboard").add({
      nama: nama,
      pelajaran: pelajaran,
      skor: skor,
      total: total,
      durasi: durasi,
      waktu: new Date().toLocaleString()
    });
    console.log("✅ Skor tersimpan di Firestore!");
  } catch (e) {
    console.error("❌ Gagal menyimpan skor:", e);
  }
}

// === Navigasi ===
function kembaliDashboard() {
  window.location.href = "dashboard.html";
}
function lihatLeaderboard() {
  window.location.href = `leaderboard.html?pelajaran=${pelajaran}`;
}
