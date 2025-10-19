// === Ambil data dari localStorage ===
const leaderboardData = JSON.parse(localStorage.getItem("leaderboardData")) || [];

// === Ambil pelajaran dari URL ===
const params = new URLSearchParams(window.location.search);
const pelajaran = params.get("pelajaran");

// === Nama pemain terakhir dari kuis ===
const pemainTerakhir = localStorage.getItem("namaPengguna");

// === Tampilkan judul ===
const judulPelajaran = document.getElementById("judul-pelajaran");
judulPelajaran.textContent = pelajaran ? pelajaran.toUpperCase() : "SEMUA PELAJARAN";

// === Filter sesuai pelajaran ===
let dataTampil = pelajaran
  ? leaderboardData.filter(item => item.pelajaran === pelajaran)
  : leaderboardData;

// === Urutkan berdasarkan nilai tertinggi ===
dataTampil.sort((a, b) => b.skor - a.skor);

// === Batasi hanya 10 terbaik ===
dataTampil = dataTampil.slice(0, 10);

// === Tampilkan tabel ===
const tbody = document.getElementById("data-leaderboard");
tbody.innerHTML = "";

if (dataTampil.length === 0) {
  const tr = document.createElement("tr");
  tr.innerHTML = `<td colspan="5">Belum ada data untuk pelajaran ini.</td>`;
  tbody.appendChild(tr);
} else {
  dataTampil.forEach((item, index) => {
    const tr = document.createElement("tr");

    // Tambahkan medali untuk 3 besar
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

// === Tombol kembali ===
function kembali() {
  window.location.href = "index.html";
}

