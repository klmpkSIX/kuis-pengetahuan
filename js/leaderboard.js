const params = new URLSearchParams(window.location.search);
const pelajaran = params.get("pelajaran") || "Semua Pelajaran";
document.getElementById("judul-pelajaran").textContent = pelajaran.toUpperCase();

const pemainTerakhir = localStorage.getItem("namaPengguna") || null;

// Ambil data dari Firestore
function ambilLeaderboard() {
  let query;

  if (pelajaran && pelajaran !== "Semua Pelajaran") {
    // tanpa orderBy untuk hindari error index
    query = db.collection("leaderboard")
      .where("pelajaran", "==", pelajaran)
      .limit(10);
  } else {
    // kalau semua pelajaran, boleh urutkan
    query = db.collection("leaderboard")
      .orderBy("skor", "desc")
      .limit(10);
  }

  query.get().then(snapshot => {
    const data = snapshot.docs.map(doc => doc.data());
    // urutkan manual kalau pakai where
    if (pelajaran && pelajaran !== "Semua Pelajaran") {
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
      tr.style.backgroundColor = "#ffffa0";
    }
    tbody.appendChild(tr);
  });
}

ambilLeaderboard();

function kembali() {
  window.location.href = "index.html";
}

