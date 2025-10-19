// === Inisialisasi Firebase ===
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// === Ambil pelajaran dari URL ===
const params = new URLSearchParams(window.location.search);
const pelajaran = params.get("pelajaran");

// === Nama pemain terakhir ===
const pemainTerakhir = localStorage.getItem("namaPengguna");

// === Tampilkan judul pelajaran ===
const judulPelajaran = document.getElementById("judul-pelajaran");
judulPelajaran.textContent = pelajaran ? pelajaran.toUpperCase() : "SEMUA PELAJARAN";

// === Ambil data dari Firestore ===
function ambilLeaderboard() {
  let query = db.collection("leaderboard").orderBy("skor", "desc").limit(10);

  if (pelajaran) {
    query = db.collection("leaderboard")
      .where("pelajaran", "==", pelajaran)
      .orderBy("skor", "desc")
      .limit(10);
  }

  query.get()
    .then(snapshot => {
      const data = snapshot.docs.map(doc => doc.data());
      tampilkanTabel(data);
    })
    .catch(err => {
      console.error("Gagal mengambil data:", err);
    });
}

// === Tampilkan data ke tabel ===
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
    const medal = ["🥇", "🥈", "🥉"][index] || index + 1;
    tr.innerHTML = `
      <td>${medal}</td>
      <td>${item.nama}</td>
      <td><strong>${item.skor}</strong></td>
      <td>${item.durasi || '-'}</td>
    `;
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

