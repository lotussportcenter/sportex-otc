import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue, set, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

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

// Креирање почетни свеќици за нови тимови во Firebase
function initializeFirebaseData(existingData) {
  const updates = {};
  let hasNewData = false;
  const now = Date.now();

  Object.keys(categories).forEach(cat => {
    categories[cat].forEach(item => {
      const itemKey = item.replace(/[^a-zA-Z0-9]/g, '_');
      if (!existingData || !existingData[itemKey] || !existingData[itemKey].candles) {
        hasNewData = true;
        const basePrice = parseFloat((Math.random() * (150 - 50) + 50).toFixed(2));
        
        let initialCandles = [];
        let prevClose = basePrice;
        for (let i = 8; i >= 1; i--) {
          const open = prevClose;
          const delta = (Math.random() * 0.8 - 0.4);
          const close = parseFloat((open + delta).toFixed(2));
          const high = parseFloat((Math.max(open, close) + Math.random() * 0.3).toFixed(2));
          const low = parseFloat((Math.min(open, close) - Math.random() * 0.3).toFixed(2));
          
          initialCandles.push({
            x: now - (i * 15000),
            o: open,
            h: high,
            l: low,
            c: close
          });
          prevClose = close;
        }

        updates['prices/' + itemKey] = {
          name: item,
          category: cat,
          initialPrice: basePrice,
          price: prevClose,
          candles: initialCandles
        };
      }
    });
  });

  if (hasNewData) {
    update(ref(db), updates);
  }
}

// Приказ на категоријата и креирање свеќичести графици
function showCategory(cat, element) {
  currentCategory = cat;
  
  // Промена на активната класа за копчињата
  if (element) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
  }

  const div = document.getElementById("stocks");
  if (!div) return;
  div.innerHTML = "";
  charts = {};

  if (!categories[cat]) return;

  categories[cat].forEach(name => {
    const itemKey = name.replace(/[^a-zA-Z0-9]/g, '_');
    const container = document.createElement("div");
    container.className = "stock-card";
    
    container.innerHTML = `
      <div class="stock-header">
        <h3 class="stock-name">${name}</h3>
        <span id="price_${itemKey}" class="stock-price">--.-- USDT</span>
      </div>
      <div class="chart-container">
        <canvas id="canvas_${itemKey}"></canvas>
      </div>
    `;
    div.appendChild(container);

    const ctx = document.getElementById(`canvas_${itemKey}`).getContext("2d");
    
    const existingCandles = (latestFirebaseData && latestFirebaseData[itemKey] && latestFirebaseData[itemKey].candles) 
      ? latestFirebaseData[itemKey].candles 
      : [];

    charts[name] = new Chart(ctx, {
      type: 'candlestick',
      data: { 
        datasets: [{ 
          label: 'Price (USDT)', 
          data: existingCandles,
          color: {
            up: '#00ff88',
            down: '#ff4949',
            unchanged: '#888888',
          }
        }] 
      },
      options: { 
        responsive: true,
        maintainAspectRatio: false,
        animation: false, 
        plugins: {
          legend: { display: false }
        },
        scales: { 
          x: { 
            type: 'time',
            time: { unit: 'second' },
            ticks: { color: '#848e9c' },
            grid: { color: '#1e2329' }
          }, 
          y: { 
            beginAtZero: false,
            ticks: { color: '#848e9c' },
            grid: { color: '#1e2329' }
          } 
        } 
      }
    });
  });

  if (latestFirebaseData) {
    updateUIWithPrices(latestFirebaseData);
  }
}

// Ажурирање на UI цените
function updateUIWithPrices(data) {
  if (!data) return;
  Object.keys(data).forEach(key => {
    const item = data[key];
    const priceEl = document.getElementById(`price_${key}`);
    
    if (priceEl && item.price !== undefined) {
      priceEl.innerText = `${item.price.toFixed(2)} USDT`;
    }

    if (charts[item.name] && item.candles) {
      charts[item.name].data.datasets[0].data = item.candles;
      charts[item.name].update('none');
    }
  });
}

// Берзанска симулација на секои 15 секунди
function startStockMarketSimulation() {
  setInterval(() => {
    if (!latestFirebaseData) return;

    const updates = {};
    const now = Date.now();

    Object.keys(latestFirebaseData).forEach(key => {
      const item = latestFirebaseData[key];
      let currentPrice = item.price;
      const initialPrice = item.initialPrice || currentPrice;

      // Суптилна промена помеѓу -0.3% и +0.3%
      const percentageChange = (Math.random() * 0.6 - 0.3) / 100;
      let openPrice = currentPrice;
      let closePrice = openPrice * (1 + percentageChange);

      if (closePrice < 1.0) closePrice = 1.0;
      const maxPrice = initialPrice * 3.0;
      if (closePrice > maxPrice) closePrice = maxPrice;

      closePrice = parseFloat(closePrice.toFixed(2));
      const highPrice = parseFloat((Math.max(openPrice, closePrice) + Math.random() * 0.15).toFixed(2));
      const lowPrice = parseFloat((Math.min(openPrice, closePrice) - Math.random() * 0.15).toFixed(2));

      let candles = item.candles ? [...item.candles] : [];
      
      candles.push({
        x: now,
        o: openPrice,
        h: highPrice,
        l: lowPrice,
        c: closePrice
      });

      if (candles.length > 12) {
        candles.shift();
      }

      updates[`prices/${key}/price`] = closePrice;
      updates[`prices/${key}/candles`] = candles;
      updates[`prices/${key}/initialPrice`] = initialPrice;
    });

    update(ref(db), updates);

  }, 15000);
}

window.addEventListener("DOMContentLoaded", () => {
  showCategory("football");

  const dbRef = ref(db, 'prices');
  onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    latestFirebaseData = data;
    
    initializeFirebaseData(data);
    updateUIWithPrices(data);
  });

  startStockMarketSimulation();
});

window.showCategory = showCategory;
