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
// === Ambil data leaderboard dari Firestore ===
db.collection("leaderboard")
  .orderBy("skor", "desc")
  .limit(10)
  .get()
  .then(snapshot => {
    const tbody = document.getElementById("data-leaderboard");
    tbody.innerHTML = "";

    snapshot.forEach((doc, index) => {
      const data = doc.data();
      const tr = document.createElement("tr");

      let peringkat = index + 1;
      let simbol = peringkat === 1 ? "🥇" : peringkat === 2 ? "🥈" : peringkat === 3 ? "🥉" : peringkat;

      tr.innerHTML = `
        <td>${simbol}</td>
        <td>${data.nama}</td>
        <td><strong>${data.skor}</strong></td>
        <td>${data.durasi || "-"}</td>
      `;
      tbody.appendChild(tr);
    });
  })
  .catch(error => {
    console.error("Gagal ambil data leaderboard:", error);
  });

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


