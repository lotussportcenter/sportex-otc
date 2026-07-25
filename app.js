import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Firebase Конфигурација
const firebaseConfig = {
  apiKey: "AIzaSyD5XFfRfOO-OsVOYtmZmZtHegKyxDZEW4s",
  authDomain: "sportex-otc.firebaseapp.com",
  databaseURL: "https://sportex-otc-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sportex-otc",
  storageBucket: "sportex-otc.firebasestorage.app",
  messagingSenderId: "938427841690",
  appId: "1:938427841690:web:8cb1d9bd74107ad588f323",
  measurementId: "G-3H2H9V3ZZF"
};

// Иницијализација на Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Сите ваши категории, лиги, тимови и играчи
const categories = {
  football: [
    "Arsenal", "Manchester City", "Manchester United", "Aston Villa", "Liverpool", "Chelsea", "Newcastle",
    "Inter", "Napoli", "Roma", "Como", "Juventus", "Fiorentina", "Milan", "Atalanta", "Lazio",
    "Bayern Munich", "Borussia Dortmund", "RB Leipzig", "VfB Stuttgart", "Hoffenheim", "Bayern Leverkusen",
    "Paris Saint-Germain", "RC Lens", "Lille OSC", "Olympique Lyon", "Olympique Marseille",
    "Real Madrid", "Barcelona", "Atlético Madrid", "Athletic Bilbao", "Real Sociedad", "Villarreal", "Sevilla", "Valencia", "Betis"
  ],
  basketball: [
    "Oklahoma City Thunder", "San Antonio Spurs", "Denver Nuggets", "Los Angeles Lakers", "Houston Rockets", "Detroit Pistons",
    "Boston Celtics", "New York Knicks", "Cleveland Cavaliers", "Toronto Raptors", "Golden State Warriors", "Miami Heat",
    "Philadelphia 76ers", "Milwaukee Bucks", "Chicago Bulls", "Dallas Mavericks", "Phoenix Suns", "Memphis Grizzlies",
    "Sacramento Kings", "Minnesota Timberwolves", "Atlanta Hawks", "Brooklyn Nets", "Charlotte Hornets", "Indiana Pacers",
    "Orlando Magic", "Utah Jazz", "Portland Trail Blazers", "New Orleans Pelicans", "Washington Wizards"
  ],
  nfl: [
    "Seattle Seahawks", "New England Patriots", "Denver Broncos", "Jacksonville Jaguars", "LA Rams", "Houston Texans",
    "Buffalo Bills", "Philadelphia Eagles", "Pittsburgh Steelers", "San Francisco 49ers", "Chicago Bears", "Green Bay Packers",
    "Minnesota Vikings", "Detroit Lions", "Dallas Cowboys", "Baltimore Ravens", "LA Chargers", "Kansas City Chiefs",
    "Miami Dolphins", "Cleveland Browns", "Cincinnati Bengals", "Washington Commanders", "New York Giants", "Tampa Bay Buccaneers",
    "Carolina Panthers", "Atlanta Falcons", "New Orleans Saints", "Indianapolis Colts", "Arizona Cardinals", "Las Vegas Raiders"
  ],
  nhl: [
    "Carolina Hurricanes", "Colorado Avalanche", "Vegas Golden Knights", "Buffalo Sabres", "Tampa Bay Lightning",
    "Montreal Canadiens", "Dallas Stars", "Minnesota Wild", "Pittsburgh Penguins", "Philadelphia Flyers", "Boston Bruins",
    "Ottawa Senators", "New York Rangers", "Toronto Maple Leafs", "Washington Capitals", "Florida Panthers",
    "New Jersey Devils", "Columbus Blue Jackets", "Detroit Red Wings", "Nashville Predators", "St. Louis Blues",
    "Winnipeg Jets", "Calgary Flames", "Edmonton Oilers", "Vancouver Canucks", "Anaheim Ducks", "Los Angeles Kings",
    "San Jose Sharks", "Chicago Blackhawks", "Utah Mammoth"
  ],
  players: [
    "Shai Gilgeous-Alexander", "Nikola Jokic", "Victor Wembanyama", "Luka Doncic", "Giannis Antetokounmpo",
    "Cristiano Ronaldo", "Lionel Messi", "Kylian Mbappe", "Erling Haaland", "Lamine Yamal",
    "Vinicius Junior", "Jude Bellingham", "Joao Felix", "Pedri", "Ferran Torres", "Marcus Rashford"
  ]
};

// Избрани топ 30 за SportEx 30 Index
const sportex30List = [
  "Real Madrid", "Barcelona", "Manchester City", "Liverpool", "Bayern Munich", "Paris Saint-Germain",
  "Boston Celtics", "Los Angeles Lakers", "Golden State Warriors", "Denver Nuggets", "Kansas City Chiefs", "San Francisco 49ers",
  "Lionel Messi", "Cristiano Ronaldo", "Kylian Mbappe", "Erling Haaland", "Nikola Jokic", "Luka Doncic",
  "Arsenal", "Inter", "Juventus", "Milwaukee Bucks", "Philadelphia 76ers", "Dallas Cowboys", "Philadelphia Eagles",
  "Edmonton Oilers", "Florida Panthers", "Victor Wembanyama", "Lamine Yamal", "Vinicius Junior"
];

let charts = {};

// Генерирање и запишување на сите нови тимови во Firebase Realtime Database
function initializeFirebaseData(existingData) {
  Object.keys(categories).forEach(cat => {
    categories[cat].forEach(item => {
      const itemKey = item.replace(/\s+/g, '_');
      if (!existingData || !existingData[itemKey]) {
        // Рандом почетна цена помеѓу 80 и 250 USDT
        const initialPrice = parseFloat((Math.random() * (250 - 80) + 80).toFixed(2));
        set(ref(db, 'prices/' + itemKey), {
          name: item,
          category: cat,
          price: initialPrice,
          history: [
            parseFloat((initialPrice * 0.98).toFixed(2)),
            parseFloat((initialPrice * 0.99).toFixed(2)),
            initialPrice
          ]
        });
      }
    });
  });
}

// Прикажи ги сите картички со графици за избраната категорија
function showCategory(cat) {
  const div = document.getElementById("stocks");
  if (!div) return;
  div.innerHTML = "";
  charts = {};

  if (!categories[cat]) return;

  categories[cat].forEach(name => {
    const container = document.createElement("div");
    container.className = "stock";
    container.style.padding = "15px";
    container.style.margin = "10px 0";
    container.style.border = "1px solid #333";
    container.style.borderRadius = "8px";
    container.style.backgroundColor = "#1a1a1a";
    container.style.color = "#ffffff";
    
    container.innerHTML = `
      <div style="display:flex; justify-between; align-items:center;">
        <h3>${name}</h3>
        <span id="price_${name.replace(/\s+/g,'_')}" style="font-weight:bold; color:#00ff88;">Loading...</span>
      </div>
      <canvas id="${name.replace(/\s+/g,'_')}"></canvas>
    `;
    div.appendChild(container);

    const ctx = document.getElementById(name.replace(/\s+/g,'_')).getContext("2d");
    charts[name] = new Chart(ctx, {
      type: 'line',
      data: { 
        labels: ['10m ago', '5m ago', 'Now'], 
        datasets: [{ label: 'Price (USDT)', data: [100, 102, 105], borderColor: '#007bff', fill: false, tension: 0.1 }] 
      },
      options: { animation: false, scales: { x: { display: true }, y: { beginAtZero: false } } }
    });
  });
}

// Вчитување на страницата и синхронизација
window.addEventListener("DOMContentLoaded", () => {
  showCategory("football");

  const dbRef = ref(db, 'prices');
  onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    
    // Се генерираат податоците во базата доколку го нема некој тим
    initializeFirebaseData(data);

    // Ажурирај ги цените на екранот
    if (data) {
      Object.keys(data).forEach(key => {
        const item = data[key];
        const priceEl = document.getElementById(`price_${key}`);
        if (priceEl && item.price) {
          priceEl.innerText = `${item.price} USDT`;
        }
      });
    }
  });
});

window.showCategory = showCategory;
