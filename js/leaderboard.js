// === Konfigurasi Firebase ===
const firebaseConfig = {
  apiKey: "AIzaSyCoPZ1se8vsj-ofFv-G4lXewKoC8shMfEA",
  authDomain: "kuis-pengetahuan-9816c.firebaseapp.com",
  projectId: "kuis-pengetahuan-9816c",
  storageBucket: "kuis-pengetahuan-9816c.firebasestorage.app",
  messagingSenderId: "635876306787",
  appId: "1:635876306787:web:86e5a4487628f75ec6ad56",
  measurementId: "G-T44R4GYSE5"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// === Ambil pelajaran dari URL ===
const params = new URLSearchParams(window.location.search);
const pelajaran = params.get("pelajaran");

// === Nama pemain terakhir dari kuis ===
const pemainTerakhir = localStorage.getItem("namaPengguna");

// === Tampilkan judul pelajaran ===
const judulPelajaran = document.getElementById("judul-pelajaran");
judulPelajaran.textContent = pelajaran ? pelajaran.toUpperCase() : "SEMUA PELAJARAN";

// === Fungsi ambil data dari Firestore ===
async function ambilLeaderboard() {
  let query = db.collection("leaderboard").orderBy("skor", "desc").limit(10);

  if (pelajaran) {
    query = db.collection("leaderboard")
      .where("pelajaran", "==", pelajaran)
      .orderBy("skor", "desc")
      .limit(10);
  }

  const snapshot = await query.get();
  const data = snapshot.docs.map(doc => doc.data());

  tampilkanTabel(data);
}

// === Fungsi tampilkan data ke tabel ===
function tampilkanTabel(data) {
  const tbody = document.getElementById("data-leaderboard");
  tbody.innerHTML = "";

  if (data.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="4">Belum ada data untuk pelajaran ini.</td>`;
    tbody.appendChild(tr);
    return;
  }

  data.forEach((item, index) => {
    const tr = document.createElement("tr");

    // Tambahkan medali 1–3
    let peringkat = index + 1;
    let simbol = "";
    if (peringkat === 1) simbol = "🥇";
    else if (peringkat === 2) simbol = "🥈";
    else if (peringkat === 3) simbol = "🥉";
    else simbol = peringkat;

    tr.innerHTML = `
      <td>${simbol}</td>
      <td>${item.nama}</td>
      <td><strong>${item.skor}</strong></td>
      <td>${item.durasi || '-'}</td>
    `;

    // Highlight pemain terakhir
    if (item.nama === pemainTerakhir) tr.classList.add("highlight");

    tbody.appendChild(tr);
  });
}

// === Jalankan ===
ambilLeaderboard();

// === Tombol kembali ===
function kembali() {
  window.location.href = "index.html";
}

