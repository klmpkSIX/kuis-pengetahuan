function masuk() {
  const nama = document.getElementById("nama").value.trim();
  if (nama.length < 3) {
    alert("Nama harus minimal 3 huruf");
    return;
  }

  const sanitize = (str) => str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  localStorage.setItem("namaPengguna", sanitize(nama));
  window.location.href = "dashboard.html";
}