import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue, set, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

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

// Иницијализација
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Категории и тимови
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

let charts = {};
let latestFirebaseData = null;
let currentCategory = "football";

// Креирање на почетни цени за сите тимови доколку ги нема во Firebase
function initializeFirebaseData(existingData) {
  Object.keys(categories).forEach(cat => {
    categories[cat].forEach(item => {
      const itemKey = item.replace(/\s+/g, '_');
      if (!existingData || !existingData[itemKey]) {
        const basePrice = parseFloat((Math.random() * (150 - 50) + 50).toFixed(2));
        set(ref(db, 'prices/' + itemKey), {
          name: item,
          category: cat,
          initialPrice: basePrice, // Се чува за да не премина над +200%
          price: basePrice,
          history: [
            parseFloat((basePrice * 0.98).toFixed(2)),
            parseFloat((basePrice * 0.99).toFixed(2)),
            basePrice
          ]
        });
      }
    });
  });
}

// Прикажување на картички и графици за избраната категорија
function showCategory(cat) {
  currentCategory = cat;
  const div = document.getElementById("stocks");
  if (!div) return;
  div.innerHTML = "";
  charts = {};

  if (!categories[cat]) return;

  categories[cat].forEach(name => {
    const itemKey = name.replace(/\s+/g, '_');
    const container = document.createElement("div");
    container.className = "stock";
    container.style.padding = "15px";
    container.style.margin = "10px 0";
    container.style.border = "1px solid #333";
    container.style.borderRadius = "8px";
    container.style.backgroundColor = "#1a1a1a";
    container.style.color = "#ffffff";
    
    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <h3>${name}</h3>
        <span id="price_${itemKey}" style="font-weight:bold; color:#00ff88; font-size:1.1em;">Loading...</span>
      </div>
      <canvas id="${itemKey}"></canvas>
    `;
    div.appendChild(container);

    const ctx = document.getElementById(itemKey).getContext("2d");
    
    // Вчитување на историските податоци од Firebase за графикот
    const existingHistory = (latestFirebaseData && latestFirebaseData[itemKey] && latestFirebaseData[itemKey].history) 
      ? latestFirebaseData[itemKey].history 
      : [100, 102, 105];

    charts[name] = new Chart(ctx, {
      type: 'line',
      data: { 
        labels: existingHistory.map((_, i) => `${i + 1}m`), 
        datasets: [{ 
          label: 'Price (USDT)', 
          data: existingHistory, 
          borderColor: '#007bff', 
          fill: false, 
          tension: 0.1 
        }] 
      },
      options: { animation: false, scales: { x: { display: false }, y: { beginAtZero: false } } }
    });
  });

  // Ажурирај ги цените на екранот ако има вчитано податоци
  if (latestFirebaseData) {
    updateUIWithPrices(latestFirebaseData);
  }
}

// Ажурирање на цените на екранот и графиците
function updateUIWithPrices(data) {
  if (!data) return;
  Object.keys(data).forEach(key => {
    const item = data[key];
    const priceEl = document.getElementById(`price_${key}`);
    
    if (priceEl && item.price !== undefined) {
      priceEl.innerText = `${item.price.toFixed(2)} USDT`;
    }

    if (charts[item.name] && item.history) {
      charts[item.name].data.labels = item.history.map((_, i) => `${i + 1}`);
      charts[item.name].data.datasets[0].data = item.history;
      charts[item.name].update('none');
    }
  });
}

// БЕРЗА ЛОГИКА: Менување на цените на секои 4.5 секунди
function startStockMarketSimulation() {
  setInterval(() => {
    if (!latestFirebaseData) return;

    const updates = {};

    Object.keys(latestFirebaseData).forEach(key => {
      const item = latestFirebaseData[key];
      let currentPrice = item.price;
      const initialPrice = item.initialPrice || currentPrice;

      // Менување на цената за променлив процент помеѓу -1.5% и +1.5%
      const percentageChange = (Math.random() * 3 - 1.5) / 100;
      let newPrice = currentPrice * (1 + percentageChange);

      // ГРАНИЦИ:
      // 1. Да не падне под 1 USDT
      if (newPrice < 1.0) {
        newPrice = 1.0;
      }

      // 2. Да не се покачи над 200% од почетната цена (максимум 3x initialPrice)
      const maxPrice = initialPrice * 3.0;
      if (newPrice > maxPrice) {
        newPrice = maxPrice;
      }

      newPrice = parseFloat(newPrice.toFixed(2));

      // Чување на историја до последните 10 точки за графикот
      let newHistory = item.history ? [...item.history] : [currentPrice];
      newHistory.push(newPrice);
      if (newHistory.length > 10) {
        newHistory.shift();
      }

      updates[`prices/${key}/price`] = newPrice;
      updates[`prices/${key}/history`] = newHistory;
      updates[`prices/${key}/initialPrice`] = initialPrice;
    });

    // Изврши го ажурирањето во Firebase
    update(ref(db), updates);

  }, 4500); // 4.5 секунди
}

// Вчитување на страницата
window.addEventListener("DOMContentLoaded", () => {
  showCategory("football");

  const dbRef = ref(db, 'prices');
  onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    latestFirebaseData = data;
    
    initializeFirebaseData(data);
    updateUIWithPrices(data);
  });

  // Започни ја симулацијата за берзата
  startStockMarketSimulation();
});

window.showCategory = showCategory;
