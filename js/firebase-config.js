// === Konfigurasi Firebase Aman ===
const firebaseConfig = {
  apiKey: "AIzaSyCoPZ1se8vsj-ofFv-G4lXewKoC8shMfEA",
  authDomain: "kuis-pengetahuan-9816c.firebaseapp.com",
  projectId: "kuis-pengetahuan-9816c",
  storageBucket: "kuis-pengetahuan-9816c.appspot.com",
  messagingSenderId: "635876306787",
  appId: "1:635876306787:web:86e5a4487628f75ec6ad56",
  measurementId: "G-T44R4GYSE5"
};

// === Inisialisasi Firebase ===
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
