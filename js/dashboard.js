// Ambil nama dari localStorage (disimpan saat login)
document.getElementById("nama-user").textContent = localStorage.getItem("namaPengguna") || "Siswa";

// Fungsi untuk membuka halaman quiz sesuai pelajaran
function bukaPelajaran(pelajaran) {
  // Simpan nama pelajaran ke localStorage (opsional)
  localStorage.setItem("pelajaranDipilih", pelajaran);
  // Arahkan ke halaman quiz
  window.location.href = `quiz.html?pelajaran=${pelajaran}`;
}

// Fungsi untuk logout
function logout() {
  localStorage.removeItem("namaPengguna");
  window.location.href = "index.html";
}
