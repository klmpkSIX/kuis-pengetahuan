// Ambil parameter dari URL
const params = new URLSearchParams(window.location.search);
const pelajaran = (params.get("pelajaran") || "Semua Pelajaran").toLowerCase();
document.getElementById("judul-pelajaran").textContent =
  pelajaran === "semua pelajaran" ? "SEMUA PELAJARAN" : pelajaran.toUpperCase();

const pemainTerakhir = localStorage.getItem("namaPengguna") || null;

// Ambil data dari Firestore
function ambilLeaderboard() {
  let query;

  // Kalau pelajaran spesifik
  if (pelajaran && pelajaran !== "semua pelajaran") {
    query = db.collection("leaderboard")
      .where("pelajaran", "==", pelajaran) // cocokkan huruf kecil
      .limit(10);
  } else {
    query = db.collection("leaderboard")
      .orderBy("skor", "desc")
      .limit(10);
  }

  query.get().then(snapshot => {
    let data = snapshot.docs.map(doc => doc.data());

    // Jika hasil kosong, ambil semua data agar tetap tampil
    if (data.length === 0 && pelajaran !== "semua pelajaran") {
      console.warn("Tidak ada data cocok, ambil semua leaderboard...");
      db.collection("leaderboard")
        .orderBy("skor", "desc")
        .limit(10)
        .get()
        .then(snapAll => {
          tampilkanLeaderboard(snapAll.docs.map(doc => doc.data()));
        });
      return;
    }

    // Urutkan manual kalau pakai where
    if (pelajaran && pelajaran !== "semua pelajaran") {
      data.sort((a, b) => b.skor - a.skor);
    }

    tampilkanLeaderboard(data);
  }).catch(err => {
    console.error("❌ Gagal ambil data leaderboard:", err);
  });
}

function tampilkanLeaderboard(data) {
  const tbody = document.getElementById("data-leaderboard");
  tbody.innerHTML = "";

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4">Belum ada data untuk pelajaran ini.</td></tr>`;
    return;
  }

  data.forEach((item, index) => {
    const tr = document.createElement("tr");
    const medal = ["🥇", "🥈", "🥉"][index] || index + 1;
    tr.innerHTML = `
      <td>${medal}</td>
      <td>${item.nama}</td>
      <td>${item.skor}</td>
      <td>${item.durasi || '-'}</td>
    `;
    if (pemainTerakhir && item.nama === pemainTerakhir) {
    }
    tbody.appendChild(tr);
  });
}

// Jalankan saat halaman dibuka
ambilLeaderboard();

// Tombol kembali
function kembali() {
  window.location.href = "index.html";
}

