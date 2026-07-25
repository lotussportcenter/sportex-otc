import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// 1. Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSy...", // Ставете го вашиот вистински API Key од Firebase Settings
  authDomain: "sportex-otc.firebaseapp.com",
  databaseURL: "https://sportex-otc-default-rtdb.firebaseio.com",
  projectId: "sportex-otc",
  storageBucket: "sportex-otc.appspot.com",
  messagingSenderId: "112803547728122503373",
  appId: "1:112803547728122503373:web:0a123..." // Ставете го вашиот вистински App ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Categories & Teams
const categories = {
  football: ["FC Barcelona","Real Madrid","Manchester United","Liverpool","Chelsea","Arsenal","Paris Saint-Germain","Juventus","Bayern Munich","Borussia Dortmund"],
  basketball: ["Los Angeles Lakers","Chicago Bulls","Golden State Warriors","Boston Celtics","Miami Heat","Milwaukee Bucks","Brooklyn Nets","Phoenix Suns"],
  tennis: ["Novak Djokovic","Rafael Nadal","Roger Federer","Carlos Alcaraz","Iga Swiatek","Coco Gauff","Aryna Sabalenka","Daniil Medvedev"],
  nfl: ["Dallas Cowboys","New England Patriots","Green Bay Packers","Kansas City Chiefs","San Francisco 49ers","Pittsburgh Steelers","Miami Dolphins","Buffalo Bills"],
  others: ["Cristiano Ronaldo","Lionel Messi","Kylian Mbappé","Erling Haaland","LeBron James","Stephen Curry","Kevin Durant","Giannis Antetokounmpo"]
};

let charts = {};

// Прикажи категорија
function showCategory(cat) {
  const div = document.getElementById("stocks");
  if (!div) return;
  div.innerHTML = "";
  charts = {};

  if (!categories[cat]) return;

  categories[cat].forEach(name => {
    const container = document.createElement("div");
    container.className = "stock";
    container.style.padding = "10px";
    container.style.margin = "10px 0";
    container.style.border = "1px solid #333";
    container.style.borderRadius = "8px";
    
    container.innerHTML = `<h3>${name}</h3><canvas id="${name.replace(/\s+/g,'_')}"></canvas>`;
    div.appendChild(container);

    const ctx = document.getElementById(name.replace(/\s+/g,'_')).getContext("2d");
    charts[name] = new Chart(ctx, {
      type: 'line',
      data: { 
        labels: ['10m ago', '5m ago', 'Now'], 
        datasets: [{ label: 'Price (USDT)', data: [100, 105, 102], borderColor: '#007bff', fill: false, tension: 0.1 }] 
      },
      options: { animation: false, scales: { x: { display: true }, y: { beginAtZero: false } } }
    });
  });
}

// Поврзи ги сите копчиња за категории откако ќе се вчита страницата
window.addEventListener("DOMContentLoaded", () => {
  // Стандардно прикажи ја категоријата Football
  showCategory("football");

  // Влечење податоци од Realtime Database (ако има соодветни јазли)
  const dbRef = ref(db, 'prices');
  onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      console.log("Примени податоци од Firebase:", data);
      // Овде можете да ги ажурирате графиците со податоци од базата
    }
  });
});

// Направи ја функцијата достапна за HTML копчињата
window.showCategory = showCategory;
