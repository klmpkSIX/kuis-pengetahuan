// === Ambil nama pengguna dan pelajaran ===
const nama = localStorage.getItem("namaPengguna") || "Siswa";
document.getElementById("nama-user").textContent = `Nama: ${nama}`;

const params = new URLSearchParams(window.location.search);
const pelajaran = params.get("pelajaran") || "matematika";
document.getElementById("judul-pelajaran").textContent = pelajaran.toUpperCase();

// === Variabel global ===
let waktuTersisa = 300; // 5 menit
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

  // Cek apakah masih ada soal
  if (indexSoal >= soalData.length) {
    tampilHasil();
    return;
  }

  const q = soalData[indexSoal];

  // Cegah error jika data rusak
  if (!q || !(q.opsi || q.pilihan) || (q.opsi || q.pilihan).length === 0) {
    console.error(`Soal ke-${indexSoal + 1} tidak valid, dilewati.`);
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
    btn.disabled = false;
    btn.className = "";
    btn.onclick = () => periksaJawaban(i);
    opsiContainer.appendChild(btn);
  });

  // pastikan tombol berikutnya disembunyikan dulu
  document.getElementById("btn-berikutnya").classList.add("hidden");
}

// === Cek jawaban ===
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

  // === Suara dan skor ===
  if (i === benarIndex) {
    skor++;
    waktuTersisa += 2;
    suaraBenar.currentTime = 0;
    suaraBenar.play();
  } else {
    suaraSalah.currentTime = 0;
    suaraSalah.play();
  }

  // === Tampilkan tombol berikutnya ===
  document.getElementById("btn-berikutnya").classList.remove("hidden");
}

function soalBerikutnya() {
  indexSoal++;

  // Sembunyikan tombol berikutnya
  document.getElementById("btn-berikutnya").classList.add("hidden");

  if (indexSoal < soalData.length) {
    tampilSoal(); // tampilkan soal baru
  } else {
    tampilHasil();
  }
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

// === Simpan skor ===
function simpanSkor(nama, pelajaran, skor, total, durasi) {
  const dataSkor = JSON.parse(localStorage.getItem("leaderboardData")) || [];
  const hasilBaru = { nama, pelajaran, skor, total, waktu: new Date().toLocaleString(), durasi };

  dataSkor.push(hasilBaru);
  dataSkor.sort((a, b) => b.skor - a.skor);

  const pelajaranList = [...new Set(dataSkor.map(i => i.pelajaran))];
  let dataFinal = [];
  pelajaranList.forEach(pel => {
    dataFinal = dataFinal.concat(
      dataSkor.filter(i => i.pelajaran === pel).slice(0, 10)
    );
  });

  localStorage.setItem("leaderboardData", JSON.stringify(dataFinal));

  const posisi = dataFinal.filter(i => i.pelajaran === pelajaran)
    .findIndex(i => i.nama === nama) + 1;
  if (posisi > 0 && posisi <= 10) {
    alert(`🎉 Selamat ${nama}! Kamu masuk ${posisi <= 3 ? "peringkat " + posisi + " besar" : "10 besar"} di ${pelajaran.toUpperCase()}!`);
  }
}

// === Navigasi ===
function kembaliDashboard() {
  window.location.href = "dashboard.html";
}
function lihatLeaderboard() {
  window.location.href = `leaderboard.html?pelajaran=${pelajaran}`;
}
